export interface Pista {
    slug: string | null;
    nombre: string | null;
    descripcion: string | null;
    imagen: string | null;
    precio: number;
    deportes: string[] | null;
    tipoPista: string | null;
    estado: string | null;
    idUsuario: string | null;
    idUsuarioModificacion: string | null;

    isActive: boolean;
    fechaCreacion: string;     // Formato ISO8601
    fechaModificacion: string; // Formato ISO8601
}

export interface PistasResponse {
    items: Pista[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
}