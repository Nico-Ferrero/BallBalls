import { MantenimientosResponse } from "./Mantenimientos.Interface";

export interface MantenimientosStateInterface {
    isLoading: boolean;
    mantenimientos: MantenimientosResponse | null;
    error: string | null;
}
