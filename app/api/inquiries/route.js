import { NextResponse } from "next/server";
import { getInquiriesData, saveInquiry } from "@/lib/db";

export async function GET() {
  try {
    const inquiries = await getInquiriesData();
    return NextResponse.json({
      success: true,
      inquiries
    });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const data = await req.json();
    if (!data.name || !data.email || !data.message) {
      return NextResponse.json(
        { success: false, message: "Missing required fields (name, email, message)" },
        { status: 400 }
      );
    }
    const newInquiry = await saveInquiry(data);
    return NextResponse.json({
      success: true,
      inquiry: newInquiry,
      message: "Inquiry saved successfully"
    });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
