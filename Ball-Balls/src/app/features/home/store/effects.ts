import { Injectable } from "@angular/core";
import { DeportesService } from "../../../core/services/deportes.service";
import { PistasService } from "../../../core/services/pistas.service";
import { inject } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { getDeportes, getDeportesSuccess, getDeportesFailure } from "./actions";
import { loadHomePistas, loadHomePistasSuccess, loadHomePistasFailure } from "./actions";
import { catchError, map, of, switchMap, mergeMap } from "rxjs";

@Injectable()
export class HomeEffects {
    private deportesService: DeportesService = inject(DeportesService);
    private pistasService: PistasService = inject(PistasService);

    //Nota: cuando se hace un dispatch de una accion, se dispara el effect
    actions$ = inject(Actions);

    getDeportes$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(getDeportes),
            switchMap(() => this.deportesService.getDeportes().pipe(
                map(deportes => getDeportesSuccess({ deportes })),
                catchError(error => of(getDeportesFailure({ error })))
            ))
        )
    })

    getHomePistas$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(loadHomePistas),
            mergeMap(({ params }) => this.pistasService.getPistas(params).pipe(
                map(pistas => loadHomePistasSuccess({ pistas })),
                catchError(error => of(loadHomePistasFailure({ error })))
            ))
        )
    })
}
