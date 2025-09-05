// Test script để test contact form API
const testContactForm = async (testData = null) => {
  const data = testData || {
    fullName: "Nguyễn Văn Test",
    email: "test@example.com",
    whatsapp: "+84 123 456 789",
    quantity: 3,
    date: "2025-12-25",
    message: "Tôi muốn đặt tour Hạ Long Bay cho gia đình 3 người vào dịp Giáng sinh. Có thể tư vấn thêm về lịch trình và giá cả không?"
  };

  try {
    console.log('🚀 Đang gửi dữ liệu test...');
    console.log('📝 Dữ liệu:', data);
    
    const response = await fetch('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Gửi thành công!');
      console.log('📊 Kết quả:', result);
      console.log('🆔 Contact ID:', result.contactId);
    } else {
      const error = await response.json();
      console.log('❌ Gửi thất bại!');
      console.log('🚨 Lỗi:', error);
      console.log('📊 Status:', response.status);
    }
  } catch (error) {
    console.log('💥 Lỗi kết nối:', error.message);
  }
};

// Test với nhiều dữ liệu khác nhau
const testMultipleSubmissions = async () => {
  const testCases = [
    {
      fullName: "Sarah Johnson",
      email: "sarah.j@email.com",
      whatsapp: "+1 555 123 4567",
      quantity: 2,
      date: "2025-11-15",
      message: "Looking for a romantic getaway in Vietnam. Interested in Hoi An and Mekong Delta."
    },
    {
      fullName: "Trần Thị Hương",
      email: "huong.tran@email.com",
      whatsapp: "+84 987 654 321",
      quantity: 5,
      date: "2025-10-20",
      message: "Cần đặt tour cho đoàn công ty 5 người. Muốn tham quan Sapa và Hà Nội."
    },
    {
      fullName: "David Chen",
      email: "david.chen@email.com",
      quantity: 1,
      date: "2025-09-30",
      message: "Solo traveler interested in adventure tours. Prefer mountain trekking and local experiences."
    }
  ];

  console.log('🔄 Bắt đầu test nhiều submissions...');
  
  for (let i = 0; i < testCases.length; i++) {
    console.log(`\n📝 Test case ${i + 1}: ${testCases[i].fullName}`);
    await testContactForm(testCases[i]);
    // Đợi 1 giây giữa các requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n🎯 Hoàn thành test!');
};

// Chạy test
console.log('🧪 Bắt đầu test Contact Form API...');
console.log('📍 URL: http://localhost:3000/api/contact');
console.log('⏰ Thời gian:', new Date().toLocaleString());

// Test single submission
testContactForm();

// Test multiple submissions (uncomment để test)
// testMultipleSubmissions();
