import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Client } from 'pg';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Postgres configuration
const pgConfig = {
    connectionString: "postgresql://postgres:TEVW3wsIrmlQ9flc@db.ejxpjpzgddmbicallhjl.supabase.co:5432/postgres",
    ssl: { rejectUnauthorized: false }
};

export async function POST(req: NextRequest) {
    try {
        const { message } = await req.json();

        if (!process.env.GEMINI_API_KEY) {
            console.warn('GEMINI_API_KEY is not set.');
            return NextResponse.json({
                reply: "Xin lỗi, tôi chưa được cấu hình khóa API Gemini. Vui lòng thêm GEMINI_API_KEY vào tệp .env!"
            });
        }

        const model = genAI.getGenerativeModel({
            model: "gemini-flash-latest",
        });

        const prompt = `Bạn là August AI Assistant, một đại diện thân thiện và chuyên nghiệp của August - Agency chuyên về Branding, Web Design và Digital Marketing.
        Nhiệm vụ của bạn là hỗ trợ khách hàng, trả lời các câu hỏi về dịch vụ của August và cung cấp thông tin hữu ích một cách sáng tạo và nhiệt tình. 
        
        QUY TẮC PHẢN HỒI:
        1. Trình bày rõ ràng, sử dụng xuống dòng để phân tách các ý.
        2. Sử dụng dấu gạch đầu dòng (-) cho danh sách.
        3. Giữ câu văn mạch lạc, ngắt nghỉ đúng chỗ.
        4. Nếu không biết chắc chắn, hãy khuyên khách hàng để lại thông tin liên hệ để được tư vấn chuyên sâu.
        
        Khách hàng hỏi: ${message}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const reply = response.text() || "Tôi có thể giúp gì thêm cho bạn không?";

        // Log to database asynchronously (don't block the response)
        const client = new Client(pgConfig);
        client.connect()
            .then(() => client.query(
                'INSERT INTO chat_logs (user_message, ai_response) VALUES ($1, $2)',
                [message, reply]
            ))
            .then(() => client.end())
            .catch(err => console.error('Error logging chat to DB:', err));

        return NextResponse.json({ reply });
    } catch (error: any) {
        console.error('Gemini API Error:', error);
        return NextResponse.json({
            message: 'Internal server error',
            error: error?.message
        }, { status: 500 });
    }
}
