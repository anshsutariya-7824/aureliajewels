import { NextResponse } from "next/server";
import { getContentData, supabase } from "@/lib/db";
import fs from "fs";
import path from "path";

const contentFilePath = path.join(process.cwd(), "data", "content.json");

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const source = searchParams.get("source");

    if (source === "local") {
      if (fs.existsSync(contentFilePath)) {
        const localContent = JSON.parse(fs.readFileSync(contentFilePath, "utf-8"));
        return NextResponse.json({
          success: true,
          content: localContent.content || localContent,
          isSupabase: !!supabase
        });
      }
    }

    const content = await getContentData();
    return NextResponse.json({
      success: true,
      content: content || {},
      isSupabase: !!supabase
    });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { content } = await req.json();
    if (!content || typeof content !== "object") {
      return NextResponse.json(
        { success: false, message: "Invalid content object" },
        { status: 400 }
      );
    }

    if (supabase) {
      const { error } = await supabase.from("content").upsert({
        key: "site_content",
        value: content
      });
      if (error) throw error;
      return NextResponse.json({ success: true, message: "Site content updated successfully in Supabase" });
    } else {
      const fileContent = { content };
      fs.writeFileSync(contentFilePath, JSON.stringify(fileContent, null, 2), "utf-8");
      return NextResponse.json({ success: true, message: "Site content updated successfully on local disk" });
    }
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
