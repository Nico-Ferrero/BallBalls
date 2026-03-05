export interface Mantenimiento {
    publicId: string;
    fecha: string;
    horaInicio: string;
    horaFin: string;
    descripcion: string;
    estado: string;
    idUsuario: string;
    idUsuarioModificacion: string;
    fechaCreacion: string;      // ISO 8601 string from DateTime
    fechaActualizacion: string; // ISO 8601 string from DateTime
    isActive: boolean;
    // Información de la Pista relacionada
    nombrePista: string;
    slugPista: string;
}

export interface MantenimientosResponse {
    mantenimientos: Mantenimiento[];
    total: number;
}