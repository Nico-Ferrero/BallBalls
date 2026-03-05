// Request interfaces para Mantenimientos API

export interface CreateMantenimientoRequest {
    slugPista: string;
    fechaMantenimiento: string;  // ISO 8601 date-time
    horaInicioMantenimiento: string;
    horaFinMantenimiento: string;
    descripcionMantenimiento: string;
}

export interface UpdateMantenimientoRequest {
    slugPista: string;
    fechaMantenimiento: string;  // ISO 8601 date-time
    horaInicioMantenimiento: string;
    horaFinMantenimiento: string;
    descripcionMantenimiento: string;
    isActive: boolean;
}
