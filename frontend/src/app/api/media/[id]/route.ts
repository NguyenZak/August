import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
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
        const mediaResult = await query('SELECT public_id FROM media WHERE id = $1', [id]);
        if (mediaResult.rowCount === 0) return NextResponse.json({ message: 'Media not found' }, { status: 404 });

        const { public_id } = mediaResult.rows[0];

        // Delete from Cloudinary
        await cloudinary.uploader.destroy(public_id);

        // Delete from DB
        await query('DELETE FROM media WHERE id = $1', [id]);
        return NextResponse.json({ message: 'Media deleted successfully' });
    } catch (error) {
        console.error('Error deleting media:', error);
        return NextResponse.json({ message: 'Failed to delete media' }, { status: 500 });
    }
}
