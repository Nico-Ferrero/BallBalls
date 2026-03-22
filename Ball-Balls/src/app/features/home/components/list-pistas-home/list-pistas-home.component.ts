import { Component, inject, ChangeDetectionStrategy, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppStateInterface } from '../../../../core/types/appState.interface';
import { selectHomePistas, selectHomePistasIsLoading, selectHomePistasError } from '../../store/selectors';
import { loadHomePistas } from '../../store/actions';
import { LucideAngularModule, MapPin, Euro, Activity, Heart, ChevronRight } from 'lucide-angular';

import { register } from 'swiper/element/bundle';
register();

@Component({
    standalone: true,
    selector: 'app-list-pistas-home',
    imports: [CommonModule, RouterLink, LucideAngularModule],
    templateUrl: './list-pistas-home.component.html',
    styleUrl: './list-pistas-home.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ListPistasHomeComponent {
    readonly MapPin = MapPin;
    readonly Euro = Euro;
    readonly Activity = Activity;
    readonly Heart = Heart;
    readonly ChevronRight = ChevronRight;

    private readonly store = inject(Store<AppStateInterface>);

    readonly isLoading$ = this.store.select(selectHomePistasIsLoading);
    readonly pistas$ = this.store.select(selectHomePistas);
    readonly error$ = this.store.select(selectHomePistasError);

    readonly skeletonItems = Array.from({ length: 4 }, (_, i) => i);

    constructor() {
        // Cargar pistas disponibles para hoy
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const disponibilidad = `${year}-${month}-${day}`;

        this.store.dispatch(loadHomePistas({
            params: {
                Disponibilidad: disponibilidad,
                PageSize: 12
            }
        }));
    }

    getStatusClass(estado: string | null | undefined): string {
        if (!estado) return 'badge--available';
        const normalized = estado.toLowerCase();
        if (normalized === 'ocupada') return 'badge--occupied';
        if (normalized === 'mantenimiento') return 'badge--maintenance';
        return 'badge--available';
    }

    getStatusLabel(estado: string | null | undefined): string {
        if (!estado) return 'Disponible';
        return estado.charAt(0).toUpperCase() + estado.slice(1).toLowerCase();
    }
}
