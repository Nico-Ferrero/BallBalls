// Request interfaces para Reservas API

export interface CreateReservaRequest {
    pista: string;
    fecha: string;
    horaInicio: string;
    horaFin: string;
    estado: string;
    tipo: string;
    club: string | null;
}

export interface UpdateReservaRequest {
    pista: string;
    fecha: string;
    horaInicio: string;
    horaFin: string;
    estado: string;
    tipo: string;
    club: string | null;
}
