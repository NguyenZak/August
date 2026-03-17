import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import AdminLayout from '@/components/layout/AdminLayout'
import BrandSettingsClient from './BrandSettingsClient'

interface BrandSettingsPageProps {
    params: Promise<{
        id: string
    }>
}

export default async function BrandSettingsPage({ params }: BrandSettingsPageProps) {
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
        <AdminLayout>
            <BrandSettingsClient brand={brand} />
        </AdminLayout>
    )
}
