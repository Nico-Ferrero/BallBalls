import { createSelector } from "@ngrx/store";
import { AppStateInterface } from "../../../core/types/appState.interface";
import { PistasStateInterface } from "../../../core/interfaces/Pistas/PistasState.interface";
import { DeportesStateInterface } from "../../../core/interfaces/Deportes/DeportesState.Interface";

export const PistasFeatures = (state: AppStateInterface) => state.pistas;

export const selectPistas = createSelector(
    PistasFeatures,
    (state: PistasStateInterface) => state.pistas
)

export const selectPistasIsLoading = createSelector(
    PistasFeatures,
    (state: PistasStateInterface) => state.isLoading
)

export const selectPistasError = createSelector(
    PistasFeatures,
    (state: PistasStateInterface) => state.error
)

export const DeportesFeatures = (state: AppStateInterface) => state.deportes;

export const selectDeportes = createSelector(
    DeportesFeatures,
    (state: DeportesStateInterface) => state.deportes
)

export const selectDeportesIsLoading = createSelector(
    DeportesFeatures,
    (state: DeportesStateInterface) => state.isLoading
)

export const selectDeportesError = createSelector(
    DeportesFeatures,
    (state: DeportesStateInterface) => state.error
)

export const selectDeportesList = createSelector(
    selectDeportes,
    (state) => {
        if (!state) return [];
        if (Array.isArray(state)) return state;
        return state.deportes || [];
    }
)
