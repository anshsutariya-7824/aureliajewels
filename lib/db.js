import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabase = supabaseUrl && supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey, { auth: { persistSession: false } }) 
  : null;

let isSeeded = false;

// Local JSON reading utilities
function getLocalProductsData() {
  const filePath = path.join(process.cwd(), "data", "products.json");
  if (!fs.existsSync(filePath)) {
    return { products: [], diamonds: [] };
  }
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch (e) {
    console.error("Error reading local products.json", e);
    return { products: [], diamonds: [] };
  }
}

function getLocalContentData() {
  const filePath = path.join(process.cwd(), "data", "content.json");
  if (!fs.existsSync(filePath)) {
    return {};
  }
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch (e) {
    console.error("Error reading local content.json", e);
    return {};
  }
}

// Seeding logic
async function seedDatabaseIfNeeded() {
  if (isSeeded || !supabase) return;
  try {
    const { data, error } = await supabase.from("products").select("id").limit(1);
    if (error) {
      console.warn("Supabase: products table query failed. Ensure tables are created.", error.message);
      return;
    }
    if (!data || data.length === 0) {
      console.log("Supabase: Database is empty. Seeding data from local JSON files...");
      const localData = getLocalProductsData();
      const localContent = getLocalContentData();

      // Seed products
      if (localData.products && localData.products.length > 0) {
        const mappedProducts = localData.products.map(p => ({
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
          is_active: p.isActive !== false
        }));
        await supabase.from("products").insert(mappedProducts);
      }

      // Seed diamonds
      if (localData.diamonds && localData.diamonds.length > 0) {
        const mappedDiamonds = localData.diamonds.map(d => ({
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
          certificate: d.certificate
        }));
        await supabase.from("diamonds").insert(mappedDiamonds);
      }

      // Seed content
      if (localContent && Object.keys(localContent).length > 0) {
        await supabase.from("content").upsert({
          key: "site_content",
          value: localContent.content || localContent
        });
      }
      console.log("Supabase: Seeding completed successfully.");
    }
    isSeeded = true;
  } catch (err) {
    console.error("Supabase: Error during automatic database seeding:", err);
  }
}

// Asynchronous getters for Next.js Pages & APIs
export async function getProductsData() {
  if (supabase) {
    await seedDatabaseIfNeeded();
    try {
      const [prodRes, diaRes] = await Promise.all([
        supabase.from("products").select("*").order("created_at", { ascending: true }),
        supabase.from("diamonds").select("*").order("created_at", { ascending: true })
      ]);

      if (prodRes.error) throw prodRes.error;
      if (diaRes.error) throw diaRes.error;

      // Map back to camelCase for Next.js pages compatibility
      const products = (prodRes.data || []).map(p => ({
        id: p.id,
        name: p.name,
        category: p.category,
        image: p.image,
        gallery: p.gallery || [],
        moq: p.moq,
        alloys: p.alloys,
        gemstones: p.gemstones,
        leadTime: p.lead_time,
        packaging: p.packaging,
        fobPrice: p.fob_price,
        description: p.description,
        isActive: p.is_active !== false
      }));

      const diamonds = (diaRes.data || []).map(d => ({
        id: isNaN(Number(d.id)) ? d.id : Number(d.id),
        name: d.name,
        carat: Number(d.carat),
        shape: d.shape,
        cut: d.cut,
        clarity: d.clarity,
        color: d.color,
        image: d.image,
        isNew: d.is_new || false,
        isFeatured: d.is_featured || false,
        isRare: d.is_rare || false,
        isInvestment: d.is_investment || false,
        measurements: d.measurements,
        table: d.table,
        depth: d.depth,
        polish: d.polish,
        symmetry: d.symmetry,
        fluorescence: d.fluorescence,
        certificate: d.certificate
      }));

      return { products, diamonds };
    } catch (e) {
      console.error("Supabase query error, falling back to local JSON:", e.message);
    }
  }
  return getLocalProductsData();
}

export async function getContentData() {
  if (supabase) {
    await seedDatabaseIfNeeded();
    try {
      const { data, error } = await supabase
        .from("content")
        .select("value")
        .eq("key", "site_content")
        .single();

      if (error && error.code !== "PGRST116") { // Ignore record not found error
        throw error;
      }
      if (data && data.value) {
        return data.value;
      }
    } catch (e) {
      console.error("Supabase content query error, falling back to local JSON:", e.message);
    }
  }
  // Return the content value directly (since old-db.js did .content or read copy)
  const localContent = getLocalContentData();
  return localContent.content || localContent;
}

export function formatImagePath(src) {
  if (!src) return "";
  if (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("data:")) return src;
  if (src.startsWith("/")) return src;
  return `/${src}`;
}
