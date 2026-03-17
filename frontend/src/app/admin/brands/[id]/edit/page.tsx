import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import HTMLEditor from '@/components/builder/HTMLEditor'

interface EditBrandPageProps {
    params: Promise<{
        id: string
    }>
}

export default async function EditBrandPage({ params }: EditBrandPageProps) {
    const { id } = await params
    const supabase = await createClient()

    const { data: brand, error } = await supabase
        .from('brands')
        .select('*')
        .eq('id', id)
        .single()

    if (error || !brand) {
        return notFound()
    }

    return (
        <HTMLEditor 
            brandId={brand.id} 
            brandName={brand.name} 
            initialHtml={brand.html_content} 
        />
    )
}
