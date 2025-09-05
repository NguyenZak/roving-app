import { NextResponse } from "next/server";

export async function GET() {
  try {
    return NextResponse.json({ 
      ok: true, 
      message: "Test API working",
      env: {
        emailUser: process.env.EMAIL_USER ? "Set" : "Not set",
        emailPass: process.env.EMAIL_PASS ? "Set" : "Not set",
        adminEmail: process.env.ADMIN_EMAIL ? "Set" : "Not set"
      }
    });
  } catch (error) {
    return NextResponse.json({ 
      ok: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
