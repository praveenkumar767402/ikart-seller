const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const SELLER_API = 'http://localhost:8000/api';
const USER_API = 'http://localhost:5000/api';
const IMAGE_PATH = path.join(__dirname, 'test_image.jpg');

async function verifyImageUpload() {
    try {
        console.log('--- Starting Image Upload Verification ---');

        // 1. Register Seller
        const sellerData = {
            name: 'Image Test Seller',
            email: `img_seller_${Date.now()}@test.com`,
            password: 'password123'
        };
        console.log('1. Registering Seller:', sellerData.email);
        const signupRes = await axios.post(`${SELLER_API}/auth/signup`, sellerData);
        const { token, user: seller } = signupRes.data;
        console.log('   Seller Registered. ID:', seller.id);

        // 2. Upload Image
        console.log('2. Uploading Profile Image...');
        const formData = new FormData();
        formData.append('companyName', 'Updated Company Name');
        formData.append('bio', 'Updated Bio');
        formData.append('image', fs.createReadStream(IMAGE_PATH));

        const uploadRes = await axios.put(`${SELLER_API}/seller/profile`, formData, {
            headers: {
                'x-auth-token': token,
                ...formData.getHeaders()
            }
        });

        const updatedSeller = uploadRes.data.seller;
        console.log('   Upload Response:', uploadRes.status);
        if (updatedSeller.image) {
            console.log('   ✅ Seller Image URL:', updatedSeller.image);
        } else {
            console.error('   ❌ Image URL missing in response');
        }

        console.log('   Waiting for sync...');
        await new Promise(r => setTimeout(r, 2000));

        // 3. Verify in User Backend
        console.log('3. Verifying in User Backend...');
        // We can check via creator API
        const creatorRes = await axios.get(`${USER_API}/creators/${seller.id}`);
        // Note: The field in User backend might be 'image' or not returned if not in DTO.
        // I updated creatorController to return 'image: null' defaulting or from DB.
        // Let's check what it returns.

        const userSideSeller = creatorRes.data;
        // In my update to getCreatorById:
        // image: null, // Seller model doesn't have image yet? (I wrote this comment)
        // But I updated the *model* to have image.
        // I did *not* update the creatorController.js to explicitly map the image field if I hardcoded null.
        // Let's check creatorController.js again.

        if (userSideSeller.image) {
            console.log('   ✅ User Side Image:', userSideSeller.image);
        } else {
            console.log('   ❓ User Side Image missing/null. Checking if controller maps it...');
            // It might be that I forgot to update the controller mapping?
            console.log('   Received Data:', JSON.stringify(userSideSeller, null, 2));
        }

    } catch (error) {
        console.error('❌ Error:', error.response ? error.response.data : error.message);
    }
}

verifyImageUpload();
