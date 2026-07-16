// Script to manually seed/push all local JSON data to Supabase database.
// Run this using: node scripts/seed-db.js

const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

// 1. Simple helper to parse and load .env / .env.local
function loadEnv() {
  const envPaths = [
    path.join(__dirname, "../.env.local"),
    path.join(__dirname, "../.env"),
  ];
  let found = false;
  for (const envPath of envPaths) {
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, "utf-8");
      content.split(/\r?\n/).forEach((line) => {
        const trimmedLine = line.trim();
        if (!trimmedLine || trimmedLine.startsWith("#")) return;
        const parts = trimmedLine.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
        if (parts) {
          const key = parts[1];
          let value = parts[2] || "";
          if (value.startsWith('"') && value.endsWith('"')) {
            value = value.slice(1, -1);
          } else if (value.startsWith("'") && value.endsWith("'")) {
            value = value.slice(1, -1);
          }
          process.env[key] = value.trim();
        }
      });
      console.log(`Loaded environment keys from ${path.basename(envPath)}`);
      found = true;
      break;
    }
  }
  if (!found) {
    console.warn("Warning: No .env or .env.local file found. Will try to use system environment variables.");
  }
}

async function seed() {
  loadEnv();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("\n[ERROR] Missing database keys!");
    console.error("Please ensure you have configured your environment variables.");
    console.error("Create a '.env.local' file in the root folder with:");
    console.error("NEXT_PUBLIC_SUPABASE_URL=your-supabase-url");
    console.error("SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key");
    process.exit(1);
  }

  console.log(`\nConnecting to Supabase at: ${supabaseUrl}`);
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false },
  });

  // 2. Read local JSON data
  const productsFilePath = path.join(__dirname, "../data/products.json");
  const contentFilePath = path.join(__dirname, "../data/content.json");

  if (!fs.existsSync(productsFilePath)) {
    console.error(`[ERROR] File not found: ${productsFilePath}`);
    process.exit(1);
  }
  if (!fs.existsSync(contentFilePath)) {
    console.error(`[ERROR] File not found: ${contentFilePath}`);
    process.exit(1);
  }

  const localData = JSON.parse(fs.readFileSync(productsFilePath, "utf-8"));
  const localContent = JSON.parse(fs.readFileSync(contentFilePath, "utf-8"));

  const products = localData.products || [];
  const diamonds = localData.diamonds || [];

  console.log(`Loaded local data: ${products.length} products, ${diamonds.length} diamonds.`);

  try {
    // 3. Clear and insert Products
    console.log("\n1. Seeding Products...");
    console.log("Clearing existing products in table...");
    const { error: delProdErr } = await supabase
      .from("products")
      .delete()
      .neq("id", "placeholder_never_matches");
    if (delProdErr) {
      throw new Error(`Failed to clear products table. Ensure you ran the SQL schema in Supabase Editor. Error: ${delProdErr.message}`);
    }

    if (products.length > 0) {
      const mappedProducts = products.map((p) => ({
        id: p.id,
        name: p.name,
        category: p.category,
        image: p.image,
        gallery: p.gallery || [],
        moq: p.moq,
        alloys: p.alloys,
        gemstones: p.gemstones,
        lead_time: p.leadTime,
        packaging: p.packaging,
        fob_price: p.fobPrice,
        description: p.description,
        is_active: p.isActive !== false,
      }));
      
      const { error: insProdErr } = await supabase.from("products").insert(mappedProducts);
      if (insProdErr) throw insProdErr;
      console.log(`✓ Inserted ${mappedProducts.length} products successfully.`);
    }

    // 4. Clear and insert Diamonds
    console.log("\n2. Seeding Diamonds...");
    console.log("Clearing existing diamonds in table...");
    const { error: delDiaErr } = await supabase
      .from("diamonds")
      .delete()
      .neq("id", "placeholder_never_matches");
    if (delDiaErr) throw delDiaErr;

    if (diamonds.length > 0) {
      const mappedDiamonds = diamonds.map((d) => ({
        id: String(d.id),
        name: d.name,
        carat: Number(d.carat),
        shape: d.shape,
        cut: d.cut,
        clarity: d.clarity,
        color: d.color,
        image: d.image,
        is_new: d.isNew || false,
        is_featured: d.isFeatured || false,
        is_rare: d.isRare || false,
        is_investment: d.isInvestment || false,
        measurements: d.measurements,
        table: d.table,
        depth: d.depth,
        polish: d.polish,
        symmetry: d.symmetry,
        fluorescence: d.fluorescence,
        certificate: d.certificate,
      }));
      
      const { error: insDiaErr } = await supabase.from("diamonds").insert(mappedDiamonds);
      if (insDiaErr) throw insDiaErr;
      console.log(`✓ Inserted ${mappedDiamonds.length} diamonds successfully.`);
    }

    // 5. Seed Content
    console.log("\n3. Seeding Page Content...");
    if (localContent && Object.keys(localContent).length > 0) {
      const { error: contentErr } = await supabase.from("content").upsert({
        key: "site_content",
        value: localContent.content || localContent,
      });
      if (contentErr) throw contentErr;
      console.log("✓ Page copywriting contents seeded successfully.");
    }

    console.log("\n=== DATABASE SEEDING COMPLETED SUCCESSFULY ===");
    console.log("All data has been pushed to your Supabase tables.");

  } catch (err) {
    console.error(`\n[FATAL ERROR] Seeding failed: ${err.message}`);
    process.exit(1);
  }
}

seed();
