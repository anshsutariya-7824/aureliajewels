import { NextResponse } from "next/server";
import { supabase } from "@/lib/db";
import fs from "fs";
import path from "path";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("image");

    if (!file) {
      return NextResponse.json({ success: false, message: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate custom filename while preserving extension
    const ext = path.extname(file.name);
    const baseName = path.basename(file.name, ext)
      .replace(/[^a-zA-Z0-9]/g, "_")
      .toLowerCase();
    const filename = `${baseName}_${Date.now()}${ext}`;

    if (supabase) {
      // Upload to Supabase Storage bucket 'images'
      const { data, error } = await supabase.storage
        .from("images")
        .upload(filename, buffer, {
          contentType: file.type || "image/jpeg",
          upsert: true
        });

      if (error) {
        throw error;
      }

      const { data: { publicUrl } } = supabase.storage
        .from("images")
        .getPublicUrl(filename);

      return NextResponse.json({
        success: true,
        filepath: publicUrl,
        filename: filename
      });
    } else {
      const uploadDir = path.join(process.cwd(), "public", "images");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const filePath = path.join(uploadDir, filename);
      fs.writeFileSync(filePath, buffer);

      const relativePath = `images/${filename}`;
      return NextResponse.json({
        success: true,
        filepath: relativePath,
        filename: filename
      });
    }
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
