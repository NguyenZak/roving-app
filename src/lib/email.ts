import nodemailer from 'nodemailer';

// Hàm kiểm tra kết nối email
export async function verifyEmailConnection() {
  try {
    await transporter.verify();
    console.log('✅ Email server connection verified successfully');
    return true;
  } catch (error) {
    console.error('❌ Email server connection failed:', error);
    return false;
  }
}

// Cấu hình transporter cho Nodemailer với xử lý lỗi tốt hơn
export const transporter = nodemailer.createTransport({
  // Sử dụng SMTP trực tiếp thay vì Gmail service
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER || 'rovingvietnamtravel@gmail.com',
    pass: process.env.EMAIL_PASS || 'dqjq vcvi nugs mfzj'
  },
  tls: {
    rejectUnauthorized: false
  },
  connectionTimeout: 10000, // 10 seconds
  greetingTimeout: 5000, // 5 seconds
  socketTimeout: 10000, // 10 seconds
  pool: true,
  maxConnections: 1,
  maxMessages: 3,
  rateDelta: 20000, // 20 seconds
  rateLimit: 5 // max 5 emails per rateDelta
});

// Template email xác nhận đẹp mắt
export function generateConfirmationEmail(contactData: {
  fullName: string;
  email: string;
  whatsapp?: string | null;
  quantity: number;
  date: string;
  message?: string | null;
}) {
  // Get email content from localStorage (or default if not available)
  let emailContent: {
    subject: string;
    greeting: string;
    intro: string;
    details: string;
    response: string;
    footer: string;
    signature: string;
  } = {
    subject: "Thank you for contacting Roving Vietnam Travel!",
    greeting: "Dear {fullName},",
    intro: "Thank you for reaching out to us about your dream vacation in Vietnam. We have received your inquiry and are excited to help you plan an unforgettable journey.",
    details: "Here are the details of your request:\n\n• Number of People: {quantity}\n• Preferred Date: {date}\n• Message: {message}\n• Contact: {email}",
    response: "Our travel experts will review your request and get back to you within 24 hours with a personalized travel proposal. We'll work closely with you to create the perfect itinerary that matches your interests and preferences.",
    footer: "If you have any urgent questions, feel free to contact us directly at +84 123 456 789 or reply to this email.",
    signature: "Best regards,\nThe Roving Vietnam Travel Team\n\n🌏 Discover Vietnam - Live Fully in Every Journey"
  };

  // Try to load custom email content from localStorage (in a real app, this would come from database/API)
  try {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('emailContent');
      if (saved) {
        const customContent = JSON.parse(saved);
        emailContent = {
          subject: customContent.confirmationSubject || emailContent.subject,
          greeting: customContent.confirmationGreeting || emailContent.greeting,
          intro: customContent.confirmationIntro || emailContent.intro,
          details: customContent.confirmationDetails || emailContent.details,
          response: customContent.confirmationResponse || emailContent.response,
          footer: customContent.confirmationFooter || emailContent.footer,
          signature: customContent.confirmationSignature || emailContent.signature
        };
      }
    }
  } catch (error) {
    console.warn('Could not load custom email content, using default:', error);
  }

  // Replace variables in email content
  const processedContent = {
    subject: emailContent.subject,
    greeting: emailContent.greeting.replace('{fullName}', contactData.fullName),
    intro: emailContent.intro,
    details: emailContent.details
      .replace('{quantity}', contactData.quantity.toString())
      .replace('{date}', contactData.date)
      .replace('{message}', contactData.message || 'No additional message')
      .replace('{email}', contactData.email),
    response: emailContent.response,
    footer: emailContent.footer,
    signature: emailContent.signature
  };

  return {
    subject: processedContent.subject,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Contact Confirmation</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f8fafc;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
            margin-top: 20px;
            margin-bottom: 20px;
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 10px;
          }
          .header p {
            margin: 0;
            font-size: 16px;
            opacity: 0.9;
          }
          .content {
            padding: 40px 30px;
          }
          .greeting {
            font-size: 18px;
            color: #2d3748;
            margin-bottom: 30px;
          }
          .info-card {
            background-color: #f7fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 25px;
            margin-bottom: 30px;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 0;
            border-bottom: 1px solid #e2e8f0;
          }
          .info-row:last-child {
            border-bottom: none;
          }
          .info-label {
            font-weight: 600;
            color: #4a5568;
            min-width: 120px;
          }
          .info-value {
            color: #2d3748;
            text-align: right;
            flex: 1;
          }
          .message-box {
            background-color: #ebf8ff;
            border: 1px solid #bee3f8;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
          }
          .message-box h3 {
            margin: 0 0 10px 0;
            color: #2b6cb0;
            font-size: 16px;
          }
          .next-steps {
            background-color: #f0fff4;
            border: 1px solid #c6f6d5;
            border-radius: 8px;
            padding: 25px;
            margin: 30px 0;
          }
          .next-steps h3 {
            margin: 0 0 15px 0;
            color: #22543d;
            font-size: 18px;
          }
          .step {
            display: flex;
            align-items: flex-start;
            margin-bottom: 15px;
          }
          .step-number {
            background-color: #48bb78;
            color: white;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: bold;
            margin-right: 15px;
            flex-shrink: 0;
          }
          .step-text {
            color: #2f855a;
            line-height: 1.5;
          }
          .contact-info {
            background-color: #fff5f5;
            border: 1px solid #fed7d7;
            border-radius: 8px;
            padding: 25px;
            text-align: center;
            margin: 30px 0;
          }
          .contact-info h3 {
            margin: 0 0 15px 0;
            color: #c53030;
            font-size: 18px;
          }
          .contact-method {
            display: inline-block;
            margin: 0 15px;
            color: #c53030;
            text-decoration: none;
            font-weight: 500;
          }
          .contact-method:hover {
            text-decoration: underline;
          }
          .footer {
            background-color: #2d3748;
            color: white;
            text-align: center;
            padding: 30px;
          }
          .footer p {
            margin: 0;
            font-size: 14px;
            opacity: 0.8;
          }
          .social-links {
            margin-top: 20px;
          }
          .social-link {
            display: inline-block;
            margin: 0 10px;
            color: white;
            text-decoration: none;
            opacity: 0.8;
          }
          .social-link:hover {
            opacity: 1;
          }
          .logo {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
          }
          @media (max-width: 600px) {
            .container {
              margin: 10px;
              border-radius: 8px;
            }
            .header, .content, .footer {
              padding: 20px;
            }
            .info-row {
              flex-direction: column;
              align-items: flex-start;
              text-align: left;
            }
            .info-value {
              text-align: left;
              margin-top: 5px;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Header -->
          <div class="header">
            <div class="logo">🌍 Roving Travel</div>
            <h1>Thank You!</h1>
            <p>We've received your inquiry</p>
          </div>

          <!-- Content -->
          <div class="content">
            <div class="greeting">
              <strong>${processedContent.greeting}</strong><br>
              ${processedContent.intro}
            </div>

            <!-- Information Card -->
            <div class="info-card">
              <h3 style="margin: 0 0 20px 0; color: #2d3748; font-size: 18px;">📋 Your Request Details</h3>
              <div style="color: #555; line-height: 1.8; margin: 0; white-space: pre-line;">${processedContent.details}</div>
            </div>

            <!-- Next Steps -->
            <div class="next-steps">
              <h3>🚀 What happens next?</h3>
              <p style="color: #2f855a; line-height: 1.6; margin: 0;">
                ${processedContent.response}
              </p>
            </div>

            <!-- Contact Information -->
            <div class="contact-info">
              <h3>📞 Need immediate assistance?</h3>
              <p style="margin: 0 0 15px 0; color: #c53030;">
                ${processedContent.footer}
              </p>
            </div>

            <div style="text-align: center; margin: 30px 0; color: #718096; font-size: 14px;">
              <p>⏰ <strong>Response Time:</strong> Within 24 business hours</p>
              <p>🌍 <strong>Service:</strong> 24/7 - We're always ready to help you</p>
            </div>
          </div>

          <!-- Footer -->
          <div class="footer">
            <p style="white-space: pre-line; margin: 0;">
              ${processedContent.signature}
            </p>
          </div>
        </div>
      </body>
      </html>
    `
  };
}

// Template email thông báo cho admin
export function generateAdminNotificationEmail(contactData: {
  fullName: string;
  email: string;
  whatsapp?: string | null;
  quantity: number;
  date: string;
  message?: string | null;
  contactId: string;
}) {
  const formattedDate = new Date(contactData.date).toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return {
    subject: `🔔 Liên hệ mới từ ${contactData.fullName} - Roving Travel`,
    html: `
      <!DOCTYPE html>
      <html lang="vi">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Thông báo liên hệ mới</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f8fafc;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
            margin-top: 20px;
            margin-bottom: 20px;
          }
          .header {
            background: linear-gradient(135deg, #f56565 0%, #e53e3e 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 10px;
          }
          .header p {
            margin: 0;
            font-size: 16px;
            opacity: 0.9;
          }
          .content {
            padding: 40px 30px;
          }
          .alert-box {
            background-color: #fed7d7;
            border: 1px solid #feb2b2;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 30px;
            text-align: center;
          }
          .alert-box h3 {
            margin: 0;
            color: #c53030;
            font-size: 18px;
          }
          .info-card {
            background-color: #f7fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 25px;
            margin-bottom: 30px;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 0;
            border-bottom: 1px solid #e2e8f0;
          }
          .info-row:last-child {
            border-bottom: none;
          }
          .info-label {
            font-weight: 600;
            color: #4a5568;
            min-width: 120px;
          }
          .info-value {
            color: #2d3748;
            text-align: right;
            flex: 1;
          }
          .message-box {
            background-color: #ebf8ff;
            border: 1px solid #bee3f8;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
          }
          .message-box h3 {
            margin: 0 0 10px 0;
            color: #2b6cb0;
            font-size: 16px;
          }
          .action-buttons {
            text-align: center;
            margin: 30px 0;
          }
          .action-btn {
            display: inline-block;
            margin: 0 10px;
            padding: 12px 24px;
            background-color: #3182ce;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 500;
            transition: background-color 0.3s;
          }
          .action-btn:hover {
            background-color: #2c5aa0;
          }
          .priority-high {
            background-color: #e53e3e;
            color: white;
            padding: 15px;
            border-radius: 8px;
            text-align: center;
            margin: 20px 0;
            font-weight: bold;
          }
          .footer {
            background-color: #2d3748;
            color: white;
            text-align: center;
            padding: 30px;
          }
          .footer p {
            margin: 0;
            font-size: 14px;
            opacity: 0.8;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Header -->
          <div class="header">
            <h1>🔔 Liên hệ mới từ khách hàng</h1>
            <p>Khách hàng mới đã gửi thông tin liên hệ</p>
          </div>

          <!-- Content -->
          <div class="content">
            <div class="alert-box">
              <h3>⚠️ Cần xử lý ngay!</h3>
              <p style="margin: 10px 0 0 0; color: #c53030;">
                Khách hàng <strong>${contactData.fullName}</strong> vừa gửi thông tin liên hệ.
                Vui lòng phản hồi trong vòng 24 giờ để tăng tỷ lệ chuyển đổi!
              </p>
            </div>

            <!-- Information Card -->
            <div class="info-card">
              <h3 style="margin: 0 0 20px 0; color: #2d3748; font-size: 18px;">📋 Thông tin khách hàng</h3>
              
              <div class="info-row">
                <span class="info-label">👤 Họ và tên:</span>
                <span class="info-value">${contactData.fullName}</span>
              </div>
              
              <div class="info-row">
                <span class="info-label">📧 Email:</span>
                <span class="info-value">${contactData.email}</span>
              </div>
              
              ${contactData.whatsapp ? `
              <div class="info-row">
                <span class="info-label">📱 WhatsApp:</span>
                <span class="info-value">${contactData.whatsapp}</span>
              </div>
              ` : ''}
              
              <div class="info-row">
                <span class="info-label">👥 Số người:</span>
                <span class="info-value">${contactData.quantity} người</span>
              </div>
              
              <div class="info-row">
                <span class="info-label">📅 Ngày mong muốn:</span>
                <span class="info-value">${formattedDate}</span>
              </div>
              
              <div class="info-row">
                <span class="info-label">🆔 Contact ID:</span>
                <span class="info-value">${contactData.contactId}</span>
              </div>
            </div>

            ${contactData.message ? `
            <!-- Message Box -->
            <div class="message-box">
              <h3>💬 Tin nhắn từ khách hàng:</h3>
              <p style="margin: 0; font-style: italic; color: #2b6cb0;">"${contactData.message}"</p>
            </div>
            ` : ''}

            <div class="priority-high">
              🚨 ƯU TIÊN CAO: Khách hàng này có thể đang tìm kiếm gấp!
            </div>

            <!-- Action Buttons -->
            <div class="action-buttons">
              <a href="mailto:${contactData.email}" class="action-btn">📧 Gửi email</a>
              ${contactData.whatsapp ? `
              <a href="https://wa.me/${contactData.whatsapp.replace(/[^0-9]/g, '')}" class="action-btn">📱 WhatsApp</a>
              ` : ''}
              <a href="/admin/messages" class="action-btn">👁️ Xem chi tiết</a>
            </div>

            <div style="text-align: center; margin: 30px 0; color: #718096; font-size: 14px;">
              <p>⏰ <strong>Thời gian phản hồi khuyến nghị:</strong> Trong vòng 2-4 giờ</p>
              <p>💡 <strong>Gợi ý:</strong> Gửi email chào mừng và gọi điện để tư vấn trực tiếp</p>
            </div>
          </div>

          <!-- Footer -->
          <div class="footer">
            <p><strong>Roving Travel Admin Panel</strong></p>
            <p>📧 admin@rovingtravel.com | 🌐 www.rovingtravel.com</p>
            <p style="margin-top: 20px; font-size: 12px; opacity: 0.6;">
              Email này được gửi tự động từ hệ thống quản lý.
            </p>
          </div>
        </div>
      </body>
      </html>
    `
  };
}

// Hàm gửi email xác nhận cho khách hàng
export async function sendConfirmationEmail(contactData: {
  fullName: string;
  email: string;
  whatsapp?: string | null;
  quantity: number;
  date: string;
  message?: string | null;
}) {
  try {
    // Kiểm tra kết nối trước khi gửi
    const isConnected = await verifyEmailConnection();
    if (!isConnected) {
      console.warn('Email server not available, skipping confirmation email');
      return { success: false, error: 'Email server not available' };
    }

    const emailContent = generateConfirmationEmail(contactData);
    
    const mailOptions = {
      from: `"Roving Travel" <${process.env.EMAIL_USER || 'rovingvietnamtravel@gmail.com'}>`,
      to: contactData.email,
      subject: emailContent.subject,
      html: emailContent.html
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Confirmation email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('❌ Error sending confirmation email:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Hàm gửi email thông báo cho admin
export async function sendAdminNotificationEmail(contactData: {
  fullName: string;
  email: string;
  whatsapp?: string | null;
  quantity: number;
  date: string;
  message?: string | null;
  contactId: string;
}) {
  try {
    // Kiểm tra kết nối trước khi gửi
    const isConnected = await verifyEmailConnection();
    if (!isConnected) {
      console.warn('Email server not available, skipping admin notification email');
      return { success: false, error: 'Email server not available' };
    }

    const emailContent = generateAdminNotificationEmail(contactData);
    
    const mailOptions = {
      from: `"Roving Travel Admin" <${process.env.EMAIL_USER || 'rovingvietnamtravel@gmail.com'}>`,
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER || 'rovingvietnamtravel@gmail.com',
      subject: emailContent.subject,
      html: emailContent.html
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Admin notification email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('❌ Error sending admin notification email:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
