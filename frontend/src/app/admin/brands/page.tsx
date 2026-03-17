import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Settings2, Eye, Plus, Globe } from 'lucide-react'
import AdminLayout from "@/components/layout/AdminLayout"

export default async function BrandPage() {
    const supabase = await createClient()

    const { data: brands, error } = await supabase
        .from('brands')
        .select('*')
        .order('created_at', { ascending: false })

    return (
        <AdminLayout>
            <div className="space-y-10 pb-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-4xl font-black lowercase tracking-tighter leading-none mb-2">
                            quản trị landing page
                        </h1>
                        <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">
                            Quản lý các trang landing page và subdomain của bạn
                        </p>
                    </div>
                    <Link
                        href="/admin/brands/new"
                        className="flex items-center gap-2 px-8 py-4 bg-black text-white rounded-[1.5rem] font-black text-sm lowercase transition-all hover:scale-105 shadow-xl shadow-black/10 group"
                    >
                        <Plus className="w-4 h-4 text-[#dafc69]" />
                        <span>tạo landing page mới</span>
                    </Link>
                </div>

                {/* Brands Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {brands?.map((brand: any) => (
                        <div key={brand.id} className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-100 hover:shadow-2xl hover:translate-y-[-4px] transition-all duration-300 group">
                            <div className="h-40 bg-gray-50 relative items-center justify-center flex group-hover:bg-gray-100 transition-colors" style={{ borderTop: `8px solid ${brand.primary_color || '#000'}` }}>
                                {brand.logo_url ? (
                                    <img src={brand.logo_url} alt={brand.name} className="h-16 object-contain" />
                                ) : (
                                    <div className="w-16 h-16 rounded-2xl bg-black text-[#dafc69] flex items-center justify-center text-3xl font-black">
                                        {brand.name[0]}
                                    </div>
                                )}
                                <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-md p-2 rounded-xl text-xs font-black uppercase tracking-widest text-gray-400 shadow-sm">
                                    {brand.subdomain}
                                </div>
                            </div>
                            <div className="p-8">
                                <h3 className="text-xl font-black text-gray-900 tracking-tighter mb-1 lowercase">{brand.name}</h3>
                                <div className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 tracking-widest mb-6">
                                    <Globe className="w-3 h-3" />
                                    {brand.subdomain}.augustevents.co.uk
                                </div>

                                <div className="flex gap-3">
                                    <Link
                                        href={`/admin/brands/${brand.id}/edit`}
                                        className="flex-1 text-center py-4 px-4 bg-[#dafc69] text-black rounded-2xl text-xs font-black lowercase hover:scale-105 transition-transform shadow-lg shadow-lime-400/10"
                                    >
                                        thiết kế AI
                                    </Link>
                                    <Link
                                        href={`/admin/brands/${brand.id}`}
                                        className="p-4 bg-gray-50 text-gray-400 rounded-2xl hover:bg-black hover:text-[#dafc69] transition-all"
                                    >
                                        <Settings2 size={18} />
                                    </Link>
                                    <a
                                        href={`http://${brand.subdomain}.localhost:3000`}
                                        target="_blank"
                                        className="p-4 bg-gray-50 text-gray-400 rounded-2xl hover:bg-black hover:text-[#dafc69] transition-all"
                                    >
                                        <Eye size={18} />
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}

                    {brands?.length === 0 && (
                        <div className="col-span-full py-32 text-center bg-white border-2 border-dashed border-gray-100 rounded-[2.5rem]">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Globe className="w-10 h-10 text-gray-200" />
                            </div>
                            <h3 className="text-lg font-black text-gray-900 tracking-tighter lowercase mb-2">chưa có landing page nào</h3>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Nhấn "tạo landing page mới" để bắt đầu</p>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    )
}
