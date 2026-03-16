import { Metadata } from "next";
import HomeClient from "./HomeClient";
import { supabase } from "@/lib/supabase";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const { data } = await supabase.from('site_settings').select('*');
    const settings = (data || []).reduce((acc: any, row: any) => {
      acc[row.key] = row.value;
      return acc;
    }, {});
    
    return {
      title: settings.site_title || "August - Facebook Marketing Platform",
      description: settings.site_description || "Giải pháp quản lý và tự động hóa Marketing trên Facebook. Chuyên nghiệp, hiệu quả và tối ưu.",
      openGraph: {
        title: settings.site_title || "August - Facebook Marketing Platform",
        description: settings.site_description || "Giải pháp quản lý và tự động hóa Marketing trên Facebook.",
        images: [
          {
            url: settings.og_image_url || "/assets/august/og-image.jpg",
            width: 1200,
            height: 630,
          }
        ]
      }
    };
  } catch (error) {
    return {
      title: "August - Facebook Marketing Platform"
    };
  }
}

export default function HomePage() {
  return <HomeClient />;
}
