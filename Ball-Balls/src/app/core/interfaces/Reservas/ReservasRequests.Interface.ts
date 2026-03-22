// Request interfaces para Reservas API

export interface CreateReservaRequest {
    pista: string | null;
    fecha: string | null;
    horaInicio: string | null;
    horaFin: string | null;
    estado: string | null;
    tipo: string | null;
    club: string | null;
}

export interface UpdateReservaRequest {
    pista: string | null;
    fecha: string | null;
    horaInicio: string | null;
    horaFin: string | null;
    estado: string | null;
    tipo: string | null;
    club: string | null;
}

export interface PaymentIntentResponse {
    clientSecret: string;
    reservaId: string;
}
