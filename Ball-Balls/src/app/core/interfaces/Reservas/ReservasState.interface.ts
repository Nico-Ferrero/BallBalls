import { ReservasResponse } from "./Reservas.Interface";

export interface ReservasStateInterface {
    isLoading: boolean;
    reservas: ReservasResponse | null;
    error: string | null;
}