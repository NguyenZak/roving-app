import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Test import nodemailer
    const nodemailer = require('nodemailer');
    
    // Test createTransport
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    
    // Test verify connection
    await transporter.verify();
    
    return NextResponse.json({ 
      ok: true, 
      message: "Nodemailer working correctly",
      emailUser: process.env.EMAIL_USER
    });
  } catch (error) {
    return NextResponse.json({ 
      ok: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
