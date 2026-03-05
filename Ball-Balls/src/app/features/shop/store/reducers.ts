import { createReducer, on } from "@ngrx/store"
import * as PistasActions from "./actions";
import { PistasStateInterface } from "../../../core/interfaces/Pistas/PistasState.interface";

export const PistasInitalState: PistasStateInterface = {
    error: null,
    pistas: null,
    isLoading: false
}

export const PistasReducer = createReducer(
    PistasInitalState,
    on(PistasActions.loadPistas, (state) => ({ ...state, isLoading: true })),
    on(PistasActions.loadPistasSuccess, (state, { pistas }) => ({ ...state, pistas, isLoading: false })),
    on(PistasActions.loadPistasFailure, (state, { error }) => ({ ...state, error, isLoading: false })),

    on(PistasActions.loadDeportes, (state) => ({ ...state, isLoading: true })),
    on(PistasActions.loadDeportesSuccess, (state, { deportes }) => ({ ...state, deportes, isLoading: false })),
    on(PistasActions.loadDeportesFailure, (state, { error }) => ({ ...state, error, isLoading: false })),
)