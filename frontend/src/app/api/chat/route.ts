import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: NextRequest) {
    try {
        const { message } = await req.json();

        if (!process.env.GEMINI_API_KEY) {
            console.warn('GEMINI_API_KEY is not set.');
            return NextResponse.json({
                reply: "Xin lỗi, tôi chưa được cấu hình khóa API Gemini. Vui lòng thêm GEMINI_API_KEY vào tệp .env!"
            });
        }

        // Using a more reliable way to call the model
        const model = genAI.getGenerativeModel({
            model: "gemini-flash-latest",
        });

        const prompt = `Bạn là August AI Assistant, một đại diện thân thiện và chuyên nghiệp của August - Agency chuyên về Branding, Web Design và Digital Marketing.
        Nhiệm vụ của bạn là hỗ trợ khách hàng, trả lời các câu hỏi về dịch vụ của August và cung cấp thông tin hữu ích một cách sáng tạo và nhiệt tình. 
        Nếu không biết chắc chắn, hãy khuyên khách hàng để lại thông tin liên hệ để được tư vấn chuyên sâu.
        
        Khách hàng hỏi: ${message}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const reply = response.text() || "Tôi có thể giúp gì thêm cho bạn không?";

        return NextResponse.json({ reply });
    } catch (error: any) {
        console.error('Gemini API Error:', error);
        return NextResponse.json({
            message: 'Internal server error',
            error: error?.message
        }, { status: 500 });
    }
}
