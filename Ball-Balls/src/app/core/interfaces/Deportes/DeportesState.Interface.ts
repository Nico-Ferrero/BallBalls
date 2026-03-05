import { DeportesResponse } from "./Deportes.Interface";

export interface DeportesStateInterface {
    isLoading: boolean;
    deportes: DeportesResponse | [];
    error: string | null;
}