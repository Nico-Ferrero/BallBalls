export interface Mantenimiento {
    publicId: string | null;
    fecha: string | null;
    horaInicio: string | null;
    horaFin: string | null;
    descripcion: string | null;
    estado: string | null;
    idUsuario: string | null;
    idUsuarioModificacion: string | null;
    fechaCreacion: string;      // ISO 8601 string from DateTime
    fechaActualizacion: string; // ISO 8601 string from DateTime
    isActive: boolean;
    // Información de la Pista relacionada
    nombrePista: string | null;
    slugPista: string | null;
}

export interface MantenimientosResponse {
    mantenimientos: Mantenimiento[];
    total: number;
}