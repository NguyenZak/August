export declare const supabase: import("@supabase/supabase-js").SupabaseClient<any, "public", "public", any, any>;
/**
 * Upload a file from disk to Supabase Storage
 * @param filePath Path to the file on disk
 * @param fileName Original filename
 * @param bucket Bucket name (default: 'media')
 */
export declare const uploadToSupabase: (filePath: string, fileName: string, bucket?: string) => Promise<{
    secure_url: string;
    public_id: string;
    resource_type: string;
    format: string;
}>;
//# sourceMappingURL=supabase-storage.d.ts.map