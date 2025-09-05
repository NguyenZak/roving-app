import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Check environment variables
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;
    const adminEmail = process.env.ADMIN_EMAIL;

    const configStatus = {
      emailUser: !!emailUser && emailUser !== 'rovingvietnamtravel@gmail.com',
      emailPass: !!emailPass && emailPass !== 'Roving12345',
      adminEmail: !!adminEmail && adminEmail !== 'rovingvietnamtravel@gmail.com'
    };

    const isConfigured = configStatus.emailUser && configStatus.emailPass;

    return NextResponse.json({
      isConfigured,
      configStatus,
      message: isConfigured 
        ? 'Email system is properly configured' 
        : 'Email system needs configuration'
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error checking email status:', error);
    return NextResponse.json({ 
      isConfigured: false,
      configStatus: {
        emailUser: false,
        emailPass: false,
        adminEmail: false
      },
      error: "Failed to check email status"
    }, { status: 500 });
  }
}
