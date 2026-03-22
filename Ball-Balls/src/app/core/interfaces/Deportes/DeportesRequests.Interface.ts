export interface CreateDeporteRequest {
    nombre: string;
    descripcion: string | null;
    isActive: boolean;
}

export interface CreateDeporteRequestEnvelope {
    body: CreateDeporteRequest;
}

export interface UpdateDeporteRequest {
    slug: string;
    nombre: string;
    descripcion: string | null;
    isActive: boolean;
}

export interface UpdateDeporteRequestEnvelope {
    body: UpdateDeporteRequest;
}

export interface SoftDeleteDeporteRequest {
    slug: string;
    isActive: boolean;
}

export interface SoftDeleteDeporteRequestEnvelope {
    body: SoftDeleteDeporteRequest;
}
