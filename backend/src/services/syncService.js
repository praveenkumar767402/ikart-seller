const axios = require('axios');

// Configure User Backend URL
const USER_BACKEND_URL = process.env.USER_BACKEND_URL || 'http://localhost:5000/api/sync';

const syncService = {
    // Sync Product (Create or Update)
    syncProduct: async (product) => {
        try {
            console.log(`[Sync] Sending Product Update: ${product.name}`);
            await axios.post(`${USER_BACKEND_URL}/product`, product);
            console.log('[Sync] Product Sync Successful');
        } catch (error) {
            console.error('[Sync] Product Sync Failed:', error.message);
            // Optionally: Queue for retry
        }
    },

    // Delete Product
    deleteProduct: async (productId) => {
        try {
            console.log(`[Sync] Sending Product Deletion: ${productId}`);
            await axios.delete(`${USER_BACKEND_URL}/product/${productId}`);
            console.log('[Sync] Product Deletion Sync Successful');
        } catch (error) {
            console.error('[Sync] Product Delete Sync Failed:', error.message);
        }
    },

    // Sync Seller (Create or Update)
    syncSeller: async (seller) => {
        try {
            console.log(`[Sync] Sending Seller Update: ${seller.companyName}`);
            await axios.post(`${USER_BACKEND_URL}/seller`, seller);
            console.log('[Sync] Seller Sync Successful');
        } catch (error) {
            console.error('[Sync] Seller Sync Failed:', error.message);
        }
    }
};

module.exports = syncService;
