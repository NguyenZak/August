
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '.env.local' });

async function listModels() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    try {
        // The SDK might not have a direct listModels, but we can try v1 API via fetch or use the internal method if exists
        // Actually, let's try a few known alternatives first
        console.log('Testing gemini-1.5-flash...');
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        await model.generateContent("Hi");
        console.log("Success with gemini-1.5-flash");
    } catch (err) {
        console.error('Error with gemini-1.5-flash:', err.message);

        try {
            console.log('Testing gemini-pro...');
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });
            await model.generateContent("Hi");
            console.log("Success with gemini-pro");
        } catch (err2) {
            console.error('Error with gemini-pro:', err2.message);
        }
    }
}

listModels();
