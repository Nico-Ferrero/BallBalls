export interface CreateDeporteRequest {
    nombre: string;
    descripcion: string | null;
    isActive: boolean;
}

export interface UpdateDeporteRequest {
    slug: string;
    nombre: string;
    descripcion: string | null;
    isActive: boolean;
}

export interface SoftDeleteDeporteRequest {
    slug: string;
    isActive: boolean;
}
