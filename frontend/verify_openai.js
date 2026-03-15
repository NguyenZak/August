
const { OpenAI } = require('openai');
require('dotenv').config({ path: '.env.local' });

async function verifyOpenAI() {
    console.log('API Key present:', !!process.env.OPENAI_API_KEY);
    if (!process.env.OPENAI_API_KEY) return;

    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    try {
        console.log('Sending test message to OpenAI...');
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [{ role: "user", content: "Hello" }],
            max_tokens: 5,
        });
        console.log('OpenAI Response:', response.choices[0].message.content);
        console.log('VERIFICATION SUCCESS');
    } catch (err) {
        console.error('VERIFICATION FAILED:', err.message);
        if (err.message.includes('401')) {
            console.log('Error 401: API Key might be invalid or not yet active.');
        } else if (err.message.includes('insufficient_quota')) {
            console.log('Error: Insufficient quota (Billing issue).');
        }
    }
}

verifyOpenAI();
