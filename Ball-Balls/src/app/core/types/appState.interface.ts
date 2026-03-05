import { DeportesStateInterface } from "../interfaces/Deportes/DeportesState.Interface";
import { PistasStateInterface } from "../interfaces/Pistas/PistasState.interface";
import { ReservasStateInterface } from "../interfaces/Reservas/ReservasState.interface";
import { MantenimientosStateInterface } from "../interfaces/Mantenimientos/MantenimientosState.Interface";

export interface AppStateInterface {
    deportes: DeportesStateInterface;
    pistas: PistasStateInterface;
    homePistas: PistasStateInterface;
    reservas: ReservasStateInterface;
    mantenimientos: MantenimientosStateInterface;
}