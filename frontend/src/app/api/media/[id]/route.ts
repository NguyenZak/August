import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { authenticateJWT } from '@/lib/auth';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const user = authenticateJWT(req);
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    try {
        const { id } = await params;
        const { data: media, error: fetchError } = await supabase
            .from('media')
            .select('public_id')
            .eq('id', id)
            .single();

        if (fetchError || !media) return NextResponse.json({ message: 'Media not found' }, { status: 404 });

        const { public_id } = media;

        // Delete from Cloudinary
        await cloudinary.uploader.destroy(public_id);

        // Delete from DB
        const { error: deleteError } = await supabase
            .from('media')
            .delete()
            .eq('id', id);

        if (deleteError) throw deleteError;

        return NextResponse.json({ message: 'Media deleted successfully' });
    } catch (error: any) {
        console.error('Error deleting media:', error);
        return NextResponse.json({ message: 'Failed to delete media', error: error.message }, { status: 500 });
    }
}
