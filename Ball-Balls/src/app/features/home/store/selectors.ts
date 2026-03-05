import { createSelector } from "@ngrx/store";
import { DeportesStateInterface } from "../../../core/interfaces/Deportes/DeportesState.Interface";
import { PistasStateInterface } from "../../../core/interfaces/Pistas/PistasState.interface";
import { AppStateInterface } from "../../../core/types/appState.interface";

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
        if (Array.isArray(state)) return state;
        return state.deportes || [];
    }
)

///Pistas Home///

export const HomePistasFeatures = (state: AppStateInterface) => state.homePistas;

export const selectHomePistas = createSelector(
    HomePistasFeatures,
    (state: PistasStateInterface) => state.pistas
)

export const selectHomePistasIsLoading = createSelector(
    HomePistasFeatures,
    (state: PistasStateInterface) => state.isLoading
)

export const selectHomePistasError = createSelector(
    HomePistasFeatures,
    (state: PistasStateInterface) => state.error
)
