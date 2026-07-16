import { NextResponse } from "next/server";
import { deleteInquiry } from "@/lib/db";

export async function DELETE(req, { params }) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    if (!id) {
      return NextResponse.json({ success: false, message: "Missing inquiry ID" }, { status: 400 });
    }
    await deleteInquiry(id);
    return NextResponse.json({ success: true, message: "Inquiry deleted successfully" });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
