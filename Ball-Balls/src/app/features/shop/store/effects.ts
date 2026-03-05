import { Injectable } from "@angular/core";
import { PistasService } from "../../../core/services/pistas.service";
import { DeportesService } from "../../../core/services/deportes.service";
import { inject } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { loadPistas, loadPistasSuccess, loadPistasFailure } from "./actions";
import { mergeMap, map, catchError } from "rxjs";
import { of } from "rxjs";
import { PistasQueryParams } from "../../../core/interfaces/Pistas/PistasRequests.Interface";
import { loadDeportes, loadDeportesSuccess, loadDeportesFailure } from "./actions";

@Injectable()
export class ShopEffects {
    private PistasService: PistasService = inject(PistasService);
    private deportesService: DeportesService = inject(DeportesService);

    //Nota: cuando se hace un dispatch de una accion, se dispara el effect
    actions$ = inject(Actions);

    getPistas$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(loadPistas),
            mergeMap(({ params }) => this.PistasService.getPistas(params).pipe(
                map(pistas => loadPistasSuccess({ pistas, params })),
                catchError(error => of(loadPistasFailure({ error })))
            ))
        );
    })

    getDeportes$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(loadDeportes),
            mergeMap(() => this.deportesService.getDeportes().pipe(
                map(deportes => loadDeportesSuccess({ deportes })),
                catchError(error => of(loadDeportesFailure({ error })))
            ))
        );
    })
}