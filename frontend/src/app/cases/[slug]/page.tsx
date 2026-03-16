import { Metadata } from "next";
import CaseDetailClient from "./CaseDetailClient";
import { supabase } from "@/lib/supabase";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    const { data: project } = await supabase
        .from('cases')
        .select('*')
        .eq('slug', slug)
        .single();
    
    if (!project) return { title: "Dự án | August" };

    return {
      title: project.title,
      description: project.category + (project.industry ? ` - ${project.industry}` : ""),
      openGraph: {
        title: project.title,
        description: project.category,
        images: [
          {
            url: project.image_url,
            width: 1200,
            height: 630,
            alt: project.title,
          }
        ],
        type: 'article',
      }
    };
  } catch (error) {
    return {
      title: "Dự án | August"
    };
  }
}

export default function ProjectPage() {
  return <CaseDetailClient />;
}
