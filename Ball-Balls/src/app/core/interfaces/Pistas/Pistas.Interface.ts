import { Deporte } from "../Deportes/Deportes.Interface";

export interface Pista {
    slug: string;
    nombre: string;
    descripcion: string;
    imagen?: string;            // URL de imagen
    precio: number;             // Llega con formato decimal

    deporte: Deporte;
    tipoPista: string;
    estado: string;
    idUsuario: string;
    idUsuarioModificacion: string | null;

    isActive: boolean;
    fechaCreacion: string;      // Formato ISO8601
    fechaActualizacion: string; // Formato ISO8601
}

export interface PistasResponse {
    items: Pista[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
}