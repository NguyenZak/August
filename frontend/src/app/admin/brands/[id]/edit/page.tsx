import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import BrandBuilder from '@/components/builder/BrandBuilder'

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
        <div className="min-h-screen bg-white">
            <BrandBuilder brandId={brand.id} initialSections={brand.sections} />
        </div>
    )
}
