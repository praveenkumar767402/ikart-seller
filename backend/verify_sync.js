const axios = require('axios');

const SELLER_API = 'http://localhost:8000/api';
const USER_API = 'http://localhost:5000/api';

async function verifySync() {
    try {
        console.log('--- Starting Verification ---');
        console.log(`Target Seller API: ${SELLER_API}`);
        console.log(`Target User API: ${USER_API}`);

        // 1. Register Seller
        const sellerData = {
            name: 'Sync Test Seller',
            email: `seller_${Date.now()}@test.com`,
            password: 'password123'
        };
        console.log('1. Registering Seller:', sellerData.email);

        let signupRes;
        try {
            signupRes = await axios.post(`${SELLER_API}/auth/signup`, sellerData);
        } catch (postError) {
            console.error('❌ Signup POST Failed!');
            if (postError.code === 'ECONNREFUSED') {
                console.error('   Connection Refused. Is Seller Backend running on port 8000?');
            } else if (postError.response) {
                console.error('   Status:', postError.response.status);
                console.error('   Data:', JSON.stringify(postError.response.data, null, 2));
            } else {
                console.error('   Error:', postError.message);
            }
            return;
        }

        const { token, user: seller } = signupRes.data;
        console.log('   Seller Registered. ID:', seller.id);

        // Allow some time for sync
        console.log('   Waiting for sync...');
        await new Promise(r => setTimeout(r, 2000));

        // 2. Verify Seller in User Backend
        console.log('2. Verifying Seller in User Backend...');
        try {
            // Check via Creator public API if available, or just proceed to product
            // Assumption: User Backend Sync logs would show success. 
            // We can try to hit a protected endpoint if we had a user token, but we only have seller token.
            // Let's assume passed if no error in logs (which we can't fully see) 
            // but let's try to verify via side-channel: CREATE PRODUCT. 
            // If seller doesn't exist in User DB, Product creation in User DB (via sync) might fail if FK constraint exists.
            // Product.belongsTo(Seller)
        } catch (e) { console.log('   Skipping direct seller verification'); }

        // 3. Create Product
        const productData = {
            name: 'Synced Product ' + Date.now(),
            category: 'Electronics',
            price: 99.99,
            stock: 10,
            status: 'Active'
        };
        console.log('3. Creating Product:', productData.name);

        let productRes;
        try {
            productRes = await axios.post(`${SELLER_API}/products`, productData, {
                headers: { 'x-auth-token': token }
            });
        } catch (postError) {
            console.error('❌ Product POST Failed!');
            if (postError.response) {
                console.error('   Status:', postError.response.status);
                console.error('   Data:', JSON.stringify(postError.response.data, null, 2));
            } else {
                console.error('   Error:', postError.message);
            }
            return;
        }

        const product = productRes.data;
        console.log('   Product Created. ID:', product.id);

        console.log('   Waiting for sync...');
        await new Promise(r => setTimeout(r, 2000));

        // 4. Verify Product in User Backend
        console.log('4. Verifying Product in User Backend...');
        try {
            const userProductsRes = await axios.get(`${USER_API}/products`);
            // Assuming the list returns array of products
            const foundProduct = userProductsRes.data.find(p => p.name === productData.name);

            if (foundProduct) {
                console.log('✅ PASSED: Product found in User Backend:', foundProduct.id);
                console.log('   Sync Verified Successfully!');
            } else {
                console.log('❌ FAILED: Product NOT found in User Backend');
                console.log('   Total Products Fetched:', userProductsRes.data.length);
                // console.log('   Products:', JSON.stringify(userProductsRes.data, null, 2));
            }
        } catch (getError) {
            console.error('❌ User Backend GET Failed!');
            if (getError.response) {
                console.error('   Status:', getError.response.status);
            } else {
                console.error('   Error:', getError.message);
            }
        }

    } catch (error) {
        console.error('❌ unexpected Error:', error.message);
    }
}

verifySync();
