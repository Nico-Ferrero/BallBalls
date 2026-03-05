import { PistasResponse } from "../../../core/interfaces/Pistas/Pistas.Interface";
import { DeportesResponse } from "../../../core/interfaces/Deportes/Deportes.Interface";

//Definimos la accion y el payload
import { createAction, props } from "@ngrx/store";
import { PistasQueryParams } from "../../../core/interfaces/Pistas/PistasRequests.Interface";

export const loadPistas = createAction('[Shop] Load Pistas', props<{ params: PistasQueryParams }>());
export const loadPistasSuccess = createAction('[Shop] Load Pistas Success', props<{ pistas: PistasResponse, params: PistasQueryParams }>());
export const loadPistasFailure = createAction('[Shop] Load Pistas Failure', props<{ error: any }>());

export const loadDeportes = createAction('[Shop] Load Deportes');
export const loadDeportesSuccess = createAction("[Deportes] Load Deportes Success", props<{ deportes: DeportesResponse }>());
export const loadDeportesFailure = createAction("[Deportes] Load Deportes Failure", props<{ error: any }>());
