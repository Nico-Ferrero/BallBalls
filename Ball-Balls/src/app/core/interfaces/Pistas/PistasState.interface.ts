import { PistasResponse } from "./Pistas.Interface";

export interface PistasStateInterface {
    isLoading: boolean;
    pistas: PistasResponse | null;
    error: string | null;
}