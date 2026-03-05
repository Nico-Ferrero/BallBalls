export interface Reserva {
    publicId: string;
    pista: string;
    fechaHoraInicio: string;
    fechaHoraFin: string;
    precioTotal: number;

    estado: string;
    tipo: string;
    club: string | null;

    usuario: string | null;
}

export interface ReservasResponse {
    reservas: Reserva[];
    total: number;
}