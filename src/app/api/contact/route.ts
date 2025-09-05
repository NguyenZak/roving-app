import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
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

    // Save contact form submission to database
    const contact = await prisma.contact.create({
      data: {
        fullName,
        email,
        whatsapp: whatsapp || null,
        quantity,
        date: new Date(date),
        message: message || null,
        status: "new"
      }
    });

    console.log('Contact form submission saved:', {
      id: contact.id,
      fullName,
      email,
      whatsapp,
      quantity,
      date,
      message,
      submittedAt: contact.createdAt
    });

    // Send confirmation email to customer (non-blocking)
    try {
      const emailResult = await sendConfirmationEmail({
        fullName,
        email,
        whatsapp,
        quantity,
        date,
        message
      });
      
      if (emailResult.success) {
        console.log('Confirmation email sent successfully to customer');
      } else {
        console.error('Failed to send confirmation email to customer:', emailResult.error);
      }
    } catch (emailError) {
      console.error('Error sending confirmation email to customer:', emailError);
    }

    // Send notification email to admin (non-blocking)
    try {
      const adminEmailResult = await sendAdminNotificationEmail({
        fullName,
        email,
        whatsapp,
        quantity,
        date,
        message,
        contactId: contact.id
      });
      
      if (adminEmailResult.success) {
        console.log('Admin notification email sent successfully');
      } else {
        console.error('Failed to send admin notification email:', adminEmailResult.error);
      }
    } catch (adminEmailError) {
      console.error('Error sending admin notification email:', adminEmailError);
    }

    return NextResponse.json({ 
      ok: true, 
      message: "Contact request submitted successfully",
      contactId: contact.id
    }, { status: 200 });
    
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json({ 
      ok: false, 
      error: "Internal server error" 
    }, { status: 500 });
  }
}


