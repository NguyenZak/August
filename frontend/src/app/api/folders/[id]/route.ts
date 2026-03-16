import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { authenticateJWT } from '@/lib/auth';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const user = authenticateJWT(req);
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    try {
        const { id } = await params;
        const body = await req.json();
        const { name, parent_id } = body;

        const updateData: any = {};
        if (name !== undefined) updateData.name = name;
        if (parent_id !== undefined) updateData.parent_id = parent_id;
        updateData.updated_at = new Date().toISOString();

        const { data, error } = await supabase
            .from('folders')
            .update(updateData)
            .eq('id', id)
            .select();

        if (error) throw error;
        if (!data || data.length === 0) return NextResponse.json({ message: 'Folder not found' }, { status: 404 });
        return NextResponse.json(data[0]);
    } catch (error: any) {
        console.error('Error updating folder:', error);
        return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const user = authenticateJWT(req);
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    try {
        const { id } = await params;

        // Move files to root before deleting folder
        const { error: moveError } = await supabase
            .from('media')
            .update({ folder_id: null })
            .eq('folder_id', id);

        if (moveError) throw moveError;

        const { data, error: deleteError } = await supabase
            .from('folders')
            .delete()
            .eq('id', id)
            .select();

        if (deleteError) throw deleteError;
        if (!data || data.length === 0) return NextResponse.json({ message: 'Folder not found' }, { status: 404 });

        return NextResponse.json({ message: 'Folder deleted successfully' });
    } catch (error: any) {
        console.error('Error deleting folder:', error);
        return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
    }
}
