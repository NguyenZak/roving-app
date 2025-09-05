import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Test import nodemailer
    const nodemailer = require('nodemailer');
    
    // Log environment variables
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;
    const adminEmail = process.env.ADMIN_EMAIL;
    
    // Test createTransport
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: emailUser,
        pass: emailPass
      },
      tls: {
        rejectUnauthorized: false
      }
    });
    
    // Test verify connection
    await transporter.verify();
    
    return NextResponse.json({ 
      ok: true, 
      message: "Nodemailer working correctly",
      config: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        emailUser: emailUser ? `${emailUser.substring(0, 3)}...` : 'Not set',
        emailPass: emailPass ? `${emailPass.substring(0, 3)}...` : 'Not set',
        adminEmail: adminEmail ? `${adminEmail.substring(0, 3)}...` : 'Not set'
      }
    });
  } catch (error) {
    return NextResponse.json({ 
      ok: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      env: {
        emailUser: process.env.EMAIL_USER ? 'Set' : 'Not set',
        emailPass: process.env.EMAIL_PASS ? 'Set' : 'Not set',
        adminEmail: process.env.ADMIN_EMAIL ? 'Set' : 'Not set'
      }
    }, { status: 500 });
  }
}
