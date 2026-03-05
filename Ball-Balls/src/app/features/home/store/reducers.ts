import { createReducer, on } from "@ngrx/store"
import { DeportesStateInterface } from "../../../core/interfaces/Deportes/DeportesState.Interface";
import { PistasStateInterface } from "../../../core/interfaces/Pistas/PistasState.interface";
import * as fromActions from "./actions";

//Estado inicial de deportes
const DeportesInitialState: DeportesStateInterface = {
    isLoading: false,
    deportes: [],
    error: null
}

export const reducers = createReducer(
    DeportesInitialState,
    on(fromActions.getDeportes, (state) => ({ ...state, isLoading: true })),
    on(fromActions.getDeportesSuccess, (state, { deportes }) => ({ ...state, isLoading: false, deportes })),
    on(fromActions.getDeportesFailure, (state, { error }) => ({ ...state, isLoading: false, error })),
)

//Estado inicial de pistas home
const HomePistasInitialState: PistasStateInterface = {
    isLoading: false,
    pistas: null,
    error: null
}

export const homePistasReducer = createReducer(
    HomePistasInitialState,
    on(fromActions.loadHomePistas, (state) => ({ ...state, isLoading: true })),
    on(fromActions.loadHomePistasSuccess, (state, { pistas }) => ({ ...state, pistas, isLoading: false })),
    on(fromActions.loadHomePistasFailure, (state, { error }) => ({ ...state, error, isLoading: false })),
)