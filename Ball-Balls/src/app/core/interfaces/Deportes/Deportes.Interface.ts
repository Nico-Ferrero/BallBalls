export interface Deporte {
    slug: string;
    nombre: string;
    descripcion: string | null;
    isActive: boolean;
    fechaCreacion: string;      // Formato ISO8601
    fechaActualizacion: string; // Formato ISO8601
}

export interface DeportesResponse {
    deportes: Deporte[];
    total: number;
}