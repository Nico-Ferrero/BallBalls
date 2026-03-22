// Request interfaces para Mantenimientos API

export interface CreateMantenimientoRequest {
    slugPista: string | null;
    fechaMantenimiento: string;  // ISO 8601 date-time
    horaInicioMantenimiento: string | null;
    horaFinMantenimiento: string | null;
    descripcionMantenimiento: string | null;
}

export interface UpdateMantenimientoRequest {
    slugPista: string | null;
    fechaMantenimiento: string;  // ISO 8601 date-time
    horaInicioMantenimiento: string | null;
    horaFinMantenimiento: string | null;
    descripcionMantenimiento: string | null;
    isActive: boolean;
}
