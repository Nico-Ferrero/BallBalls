//Definimos la accion y el payload
import { createAction, props } from "@ngrx/store";

//Importamos las interfaces
import { DeportesResponse } from "../../../core/interfaces/Deportes/Deportes.Interface";
import { PistasResponse } from "../../../core/interfaces/Pistas/Pistas.Interface";
import { PistasQueryParams } from "../../../core/interfaces/Pistas/PistasRequests.Interface";

////////////Querys////////////

///Deportes///

export const getDeportes = createAction("[Deportes] Get Deportes");

export const getDeportesSuccess = createAction("[Deportes] Get Deportes Success", props<{ deportes: DeportesResponse }>());
export const getDeportesFailure = createAction("[Deportes] Get Deportes Failure", props<{ error: any }>());

///Pistas Home///

export const loadHomePistas = createAction('[Home] Load Pistas', props<{ params: PistasQueryParams }>());
export const loadHomePistasSuccess = createAction('[Home] Load Pistas Success', props<{ pistas: PistasResponse }>());
export const loadHomePistasFailure = createAction('[Home] Load Pistas Failure', props<{ error: any }>());
