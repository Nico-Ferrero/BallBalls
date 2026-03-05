import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppStateInterface } from '../../../../core/types/appState.interface';
import { selectDeportesList, selectDeportesError, selectDeportesIsLoading } from '../../store/selectors';
import { getDeportes } from '../../store/actions';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule } from '@angular/common';

@Component({
    standalone: true,
    selector: 'app-filtros-home',
    templateUrl: './filtros-home.component.html',
    styleUrl: './filtros-home.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, ReactiveFormsModule, CalendarModule, DropdownModule]
})
export class FiltrosHomeComponent {
    private readonly store = inject(Store<AppStateInterface>);
    private readonly fb = inject(FormBuilder);

    readonly isLoading$ = this.store.select(selectDeportesIsLoading);
    readonly error$ = this.store.select(selectDeportesError);
    readonly deportes$ = this.store.select(selectDeportesList);

    private readonly router = inject(Router);

    readonly searchForm = this.fb.group({
        fecha: [null],
        deporte: [null]
    });

    constructor() {
        this.store.dispatch(getDeportes());
    }

    onSearch(): void {
        const { fecha, deporte } = this.searchForm.value;
        const queryParams: any = {};

        if (fecha) {
            const d = new Date(fecha);
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            queryParams.Disponibilidad = `${year}-${month}-${day}`;
        }

        if (deporte) {
            queryParams.Deporte = (deporte as any).nombre;
        }

        this.router.navigate(['/pistas'], { queryParams });
    }
}