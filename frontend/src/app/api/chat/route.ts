import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || '',
});

export async function POST(req: NextRequest) {
    try {
        const { message } = await req.json();

        if (!process.env.OPENAI_API_KEY) {
            console.warn('OPENAI_API_KEY is not set. Using fallback logic.');
            return NextResponse.json({
                reply: "Xin lỗi, tôi chưa được cấu hình đầy đủ. Vui lòng thêm OPENAI_API_KEY vào tệp .env để tôi có thể hỗ trợ bạn tốt hơn!"
            });
        }

        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: "Bạn là August AI Assistant, một đại diện thân thiện và chuyên nghiệp của August - Agency chuyên về Branding, Web Design và Digital Marketing. Nhiệm vụ của bạn là hỗ trợ khách hàng, trả lời các câu hỏi về dịch vụ của August và cung cấp thông tin hữu ích một cách sáng tạo và nhiệt tình. Nếu không biết chắc chắn, hãy khuyên khách hàng để lại thông tin liên hệ để được tư vấn chuyên sâu."
                },
                {
                    role: "user",
                    content: message
                }
            ],
            temperature: 0.7,
            max_tokens: 500,
        });

        const reply = response.choices[0]?.message?.content || "Tôi có thể giúp gì khác cho bạn không?";

        return NextResponse.json({ reply });
    } catch (error: any) {
        console.error('Chat API Error:', error);
        return NextResponse.json({
            message: 'Internal server error',
            error: error?.message
        }, { status: 500 });
    }
}
