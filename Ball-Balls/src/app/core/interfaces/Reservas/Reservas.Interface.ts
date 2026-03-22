export interface Reserva {
    publicId: string | null;
    pista: string | null;
    fechaHoraInicio: string | null;
    fechaHoraFin: string | null;
    precioTotal: number;

    estado: string | null;
    tipo: string | null;
    club: string | null;

    usuario: string | null;
}

export interface ReservasResponse {
    reservas: Reserva[];
    total: number;
}