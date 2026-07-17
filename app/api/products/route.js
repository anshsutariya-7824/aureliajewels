import { NextResponse } from "next/server";
import { getProductsData, supabase } from "@/lib/db";
import fs from "fs";
import path from "path";

const productsFilePath = path.join(process.cwd(), "data", "products.json");

export async function GET() {
  try {
    const data = await getProductsData();
    return NextResponse.json({
      success: true,
      products: data.products || [],
      diamonds: data.diamonds || []
    });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { products, diamonds } = await req.json();
    if (!Array.isArray(products) || !Array.isArray(diamonds)) {
      return NextResponse.json(
        { success: false, message: "Invalid products or diamonds array" },
        { status: 400 }
      );
    }

    if (supabase) {
      // 1. Clear products table and insert all
      const { error: deleteProdErr } = await supabase.from("products").delete().neq("id", "placeholder_never_matches");
      if (deleteProdErr) throw deleteProdErr;

      if (products.length > 0) {
        const mappedProducts = products.map(p => ({
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
        const { error: insertProdErr } = await supabase.from("products").insert(mappedProducts);
        if (insertProdErr) throw insertProdErr;
      }

      // 2. Clear diamonds table and insert all
      const { error: deleteDiaErr } = await supabase.from("diamonds").delete().neq("id", "placeholder_never_matches");
      if (deleteDiaErr) throw deleteDiaErr;

      if (diamonds.length > 0) {
        const mappedDiamonds = diamonds.map(d => ({
          id: String(d.id),
          name: d.name,
          carat: Number(d.carat),
          shape: d.shape,
          cut: d.cut,
          clarity: d.clarity,
          color: d.color,
          image: d.image,
          gallery: d.gallery || [],
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
        const { error: insertDiaErr } = await supabase.from("diamonds").insert(mappedDiamonds);
        if (insertDiaErr) throw insertDiaErr;
      }

      return NextResponse.json({ success: true, message: "Products and diamonds updated successfully in Supabase" });
    } else {
      const fileContent = { products, diamonds };
      fs.writeFileSync(productsFilePath, JSON.stringify(fileContent, null, 2), "utf-8");
      return NextResponse.json({ success: true, message: "Products and diamonds updated successfully on local disk" });
    }
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
