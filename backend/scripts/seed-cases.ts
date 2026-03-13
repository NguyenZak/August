import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.resolve(__dirname, '../.env') })

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!
)

async function seedCases() {
    console.log('Seeding demo cases...')

    const demoCases = [
        {
            title: "The Coffee House",
            category: "Chiến dịch Thương hiệu & Marketing F&B",
            image_url: "/assets/august/the_coffee_house.png",
            industry: "F&B",
            grid_col: 1,
            grid_col_span: 12,
            grid_row: 1,
            content: "<p>Chi tiết chiến dịch...</p>"
        },
        {
            title: "Growe Partners",
            category: "Tự động hóa xã hội & Chiến lược nội dung",
            image_url: "/assets/august/growe_partners_cover.jpg",
            industry: "Tech",
            grid_col: 1,
            grid_col_span: 7,
            grid_row: 2,
            content: "<p>Chi tiết chiến dịch...</p>"
        },
        {
            title: "Evoplay",
            category: "Tối ưu hóa UX/UI",
            image_url: "/assets/august/evoplay_cover.jpg",
            industry: "Tech",
            grid_col: 9,
            grid_col_span: 4,
            grid_row: 3,
            content: "<p>Chi tiết chiến dịch...</p>"
        },
        {
            title: "Neon Night (1win)",
            category: "Kích hoạt toàn cầu & Xây dựng thương hiệu",
            image_url: "/assets/august/neon_night_1win_cove.jpg",
            industry: "Other",
            grid_col: 3,
            grid_col_span: 8,
            grid_row: 4,
            content: "<p>Chi tiết chiến dịch...</p>"
        },
        {
            title: "Lễ hội Ánh sáng 2026",
            category: "Tổ chức sự kiện & Marketing kỹ thuật số",
            image_url: "/assets/august/luxury_event.png",
            industry: "Other",
            grid_col: 1,
            grid_col_span: 6,
            grid_row: 5,
            content: "<p>Chi tiết chiến dịch...</p>"
        },
        {
            title: "Tuần lễ Thời trang",
            category: "Sản xuất hình ảnh & Lan tỏa mạng xã hội",
            image_url: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=2076&auto=format&fit=crop",
            industry: "Other",
            grid_col: 8,
            grid_col_span: 5,
            grid_row: 6,
            content: "<p>Chi tiết chiến dịch...</p>"
        },
        {
            title: "Hệ thống Quản trị Marketing",
            category: "Giải pháp SaaS cho doanh nghiệp",
            image_url: "/assets/august/marketing_dashboard.png",
            industry: "Tech",
            grid_col: 2,
            grid_col_span: 10,
            grid_row: 7,
            content: "<p>Chi tiết chiến dịch...</p>"
        },
        {
            title: "Global Tech Summit",
            category: "Tổ chức hội nghị công nghệ quy mô lớn",
            image_url: "/assets/august/tech_summit.png",
            industry: "Tech",
            grid_col: 1,
            grid_col_span: 7,
            grid_row: 8,
            content: "<p>Chi tiết chiến dịch...</p>"
        },
        {
            title: "Billionaire Night",
            category: "Sự kiện VIP & Trải nghiệm độc quyền",
            image_url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop",
            industry: "Other",
            grid_col: 9,
            grid_col_span: 4,
            grid_row: 9,
            content: "<p>Chi tiết chiến dịch...</p>"
        },
        {
            title: "E-Sport Championship",
            category: "Livestream & Viral Marketing",
            image_url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop",
            industry: "Tech",
            grid_col: 1,
            grid_col_span: 12,
            grid_row: 10,
            content: "<p>Chi tiết chiến dịch...</p>"
        }
    ]

    for (const item of demoCases) {
        const { data, error } = await supabase.from('cases').insert([item]).select()

        if (error) {
            console.error(`Error seeding case ${item.title}:`, error)
        } else {
            console.log(`Case seeded successfully: ${item.title}`)
        }
    }
}

seedCases()
