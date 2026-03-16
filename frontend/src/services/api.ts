import api from '../lib/api-client';

export interface Case {
    id: string;
    title: string;
    slug: string;
    category: string;
    image_url: string;
    grid_row: number;
    grid_col: number;
    grid_row_span: number;
    grid_col_span: number;
    content?: string;
    industry?: string;
    menu_url?: string;
    created_at: string;
}

export interface Service {
    id: string;
    title: string;
    slug: string;
    description: string;
    content?: string;
    category: string;
    icon: string;
    image_url?: string;
}

export interface Review {
    id: string;
    author: string;
    content: string;
    project: string;
}

export interface Partner {
    id: string;
    name: string;
    url: string;
    logo: string;
}

export interface Inquiry {
    id: string;
    name: string;
    email: string;
    phone: string;
    message?: string;
    project_type?: string;
    company?: string;
    status: string;
    business_model?: string;
    website?: string;
    fanpage?: string;
    created_at: string;
}

export interface MediaItem {
    id: string;
    filename: string;
    url: string;
    public_id: string;
    resource_type: string;
    size: number;
    created_at: string;
}

export interface Folder {
    id: string;
    name: string;
    parent_id: string | null;
    created_at: string;
}

export const cmsService = {
    // Auth
    login: (credentials: { email: string; password: string }) =>
        api.post('/auth/login', credentials),

    // Cases
    getCases: () => api.get<Case[]>('cases'),
    getCaseById: (id: string) => api.get<Case>(`cases/${id}`),
    getCaseBySlug: (slug: string) => api.get<Case>(`cases/${slug}`),
    createCase: (data: Partial<Case>) => api.post('cases', data),
    updateCase: (id: string, data: Partial<Case>) => api.put(`cases/${id}`, data),
    deleteCase: (id: string) => api.delete(`cases/${id}`),
    reorderCases: (items: { id: string, grid_row: number }[]) => api.put('cases/reorder', { items }),

    // Services
    getServices: () => api.get<Service[]>('/services'),
    createService: (data: Partial<Service>) => api.post('/services', data),
    updateService: (id: string, data: Partial<Service>) => api.put(`/services/${id}`, data),
    deleteService: (id: string) => api.delete(`/services/${id}`),

    // Reviews
    getReviews: () => api.get<Review[]>('/reviews'),
    createReview: (data: Partial<Review>) => api.post('/reviews', data),
    updateReview: (id: string, data: Partial<Review>) => api.put(`/reviews/${id}`, data),
    deleteReview: (id: string) => api.delete(`/reviews/${id}`),

    // Partners
    getPartners: () => api.get<Partner[]>('/partners'),
    createPartner: (data: Partial<Partner>) => api.post('/partners', data),
    updatePartner: (id: string, data: Partial<Partner>) => api.put(`/partners/${id}`, data),
    deletePartner: (id: string) => api.delete(`/partners/${id}`),

    // Inquiries
    getInquiries: () => api.get<Inquiry[]>('/inquiries'),
    createInquiry: (data: Partial<Inquiry>) => api.post('/inquiries', data),
    updateInquiry: (id: string, data: Partial<Inquiry>) => api.put(`/inquiries/${id}`, data),
    deleteInquiry: (id: string) => api.delete(`/inquiries/${id}`),

    // Media
    uploadFile: (file: File, folder_id?: string) => {
        const formData = new FormData();
        formData.append('files', file); // API expects 'files' array even for one
        if (folder_id) formData.append('folder_id', folder_id);
        return api.post<Array<{ url: string }>>('upload', formData);
    },
    getMedia: (folder_id?: string) => api.get<MediaItem[]>('/media', { params: { folder_id } }),
    deleteMedia: (id: string) => api.delete(`/media/${id}`),

    // Folders
    getFolders: () => api.get<Folder[]>('/folders'),
    createFolder: (data: { name: string; parent_id?: string | null }) => api.post('/folders', data),
    updateFolder: (id: string, data: { name?: string; parent_id?: string | null }) => api.put(`/folders/${id}`, data),
    deleteFolder: (id: string) => api.delete(`/folders/${id}`),

    // Settings
    getSettings: () => api.get<Record<string, string>>('/settings'),
    updateSettings: (data: Record<string, string>) => api.post('/settings', data),

    // Advanced Media Actions
    bulkMoveMedia: (ids: string[], folder_id: string | null) =>
        api.post('/media/bulk-move', { ids, folder_id: folder_id || 'root' }),

    // Analytics
    getAnalyticsStats: () => api.get<{
        totalVisits: number;
        uniqueToday: number;
        deviceBreakdown: Record<string, number>;
        topPaths: [string, number][];
        recentLogs: any[];
    }>('/analytics/stats'),
};
