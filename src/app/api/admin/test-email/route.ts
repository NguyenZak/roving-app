import { NextResponse } from "next/server";
import { sendConfirmationEmail, sendAdminNotificationEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, email, whatsapp, quantity, date, message } = body ?? {};
    
    // Basic validation
    if (!fullName || !email || !quantity || !date) {
      return NextResponse.json(
        { 
          ok: false, 
          error: "Missing required fields" 
        }, 
        { status: 400 }
      );
    }

    // Test sending confirmation email to customer
    const customerEmailResult = await sendConfirmationEmail({
      fullName,
      email,
      whatsapp,
      quantity,
      date,
      message
    });

    if (!customerEmailResult.success) {
      return NextResponse.json(
        { 
          ok: false, 
          error: `Failed to send customer email: ${customerEmailResult.error}` 
        }, 
        { status: 500 }
      );
    }

    // Test sending admin notification email
    const adminEmailResult = await sendAdminNotificationEmail({
      fullName,
      email,
      whatsapp,
      quantity,
      date,
      message,
      contactId: "TEST-" + Date.now()
    });

    if (!adminEmailResult.success) {
      return NextResponse.json(
        { 
          ok: false, 
          error: `Customer email sent but admin notification failed: ${adminEmailResult.error}` 
        }, 
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      ok: true, 
      message: "Test emails sent successfully",
      customerEmailId: customerEmailResult.messageId,
      adminEmailId: adminEmailResult.messageId
    }, { status: 200 });
    
  } catch (error) {
    console.error('Test email error:', error);
    return NextResponse.json({ 
      ok: false, 
      error: "Internal server error" 
    }, { status: 500 });
  }
}
