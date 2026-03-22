export interface PistasQueryParams {
    Nombre?: string;
    Deporte?: string;
    PrecioMin?: number;
    PrecioMax?: number;
    Disponibilidad?: string;
    Orden?: string;
    PageNumber?: number;
    PageSize?: number;
}

export interface CreatePistaRequest {
    nombre: string;
    descripcion: string | null;
    imagen: string | null;
    precio: number;
    deportes: string[] | null;
    idTipoPista: string | null;
    idClub: string | null;
    idEstado: string | null;
    isActive: boolean;
}

export interface CreatePistaRequestEnvelope {
    body: CreatePistaRequest;
}

export interface UpdatePistaRequest {
    slug: string;
    nombre: string;
    descripcion: string | null;
    imagen: string | null;
    precio: number;
    deportes: string[] | null;
    tipoPista: string | null;
    estado: string | null;
    isActive: boolean;
}

export interface UpdatePistaRequestEnvelope {
    body: UpdatePistaRequest;
}

export interface SoftDeletePistaRequest {
    slug: string;
    isActive: boolean;
}

export interface SoftDeletePistaRequestEnvelope {
    body: SoftDeletePistaRequest;
}
