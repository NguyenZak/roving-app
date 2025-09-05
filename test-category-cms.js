/**
 * Test script for Category CMS functionality
 * This script tests the API endpoints for category management
 */

const API_BASE = 'http://localhost:3000/api/admin/categories';

async function testCategoryAPI() {
  console.log('🧪 Testing Category CMS API endpoints...\n');

  try {
    // Test 1: Get all categories
    console.log('1️⃣ Testing GET /api/admin/categories');
    const getResponse = await fetch(`${API_BASE}?page=1&pageSize=10`);
    const getData = await getResponse.json();
    console.log('✅ GET categories:', getResponse.status, getData);
    console.log('');

    // Test 2: Create a new category
    console.log('2️⃣ Testing POST /api/admin/categories (Create)');
    const createForm = new FormData();
    createForm.set('name', 'Test Category');
    createForm.set('order', '1');
    
    const createResponse = await fetch(API_BASE, {
      method: 'POST',
      body: createForm,
    });
    const createData = await createResponse.json();
    console.log('✅ CREATE category:', createResponse.status, createData);
    
    if (createData.id) {
      const categoryId = createData.id;
      console.log('');

      // Test 3: Get specific category
      console.log('3️⃣ Testing GET /api/admin/categories/[id]');
      const getOneResponse = await fetch(`${API_BASE}/${categoryId}`);
      const getOneData = await getOneResponse.json();
      console.log('✅ GET category by ID:', getOneResponse.status, getOneData);
      console.log('');

      // Test 4: Update category
      console.log('4️⃣ Testing PATCH /api/admin/categories/[id] (Update)');
      const updateForm = new FormData();
      updateForm.set('_method', 'PATCH');
      updateForm.set('name', 'Updated Test Category');
      updateForm.set('order', '2');
      
      const updateResponse = await fetch(`${API_BASE}/${categoryId}`, {
        method: 'POST',
        body: updateForm,
      });
      const updateData = await updateResponse.json();
      console.log('✅ UPDATE category:', updateResponse.status, updateData);
      console.log('');

      // Test 5: Delete category
      console.log('5️⃣ Testing DELETE /api/admin/categories/[id]');
      const deleteForm = new FormData();
      deleteForm.set('_method', 'DELETE');
      
      const deleteResponse = await fetch(`${API_BASE}/${categoryId}`, {
        method: 'POST',
        body: deleteForm,
      });
      const deleteData = await deleteResponse.json();
      console.log('✅ DELETE category:', deleteResponse.status, deleteData);
    }

    console.log('\n🎉 All Category CMS API tests completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the tests
testCategoryAPI();
