import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { loadPistas } from '../../store/actions';
import { getDeportes } from '../../../home/store/actions';
import { selectDeportesList } from '../../../home/store/selectors';
import { LucideAngularModule, Search, Calendar, Activity, ArrowUpDown, Euro, RefreshCcw } from 'lucide-angular';
import { SliderModule } from 'primeng/slider';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { map } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-filtros-pistas',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LucideAngularModule,
    SliderModule,
    DropdownModule,
    InputTextModule,
    CalendarModule,
    FormsModule
  ],
  templateUrl: './filtros-pistas.component.html',
  styleUrl: './filtros-pistas.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FiltrosPistasComponent {
  private fb = inject(FormBuilder);
  private store = inject(Store);
  private route = inject(ActivatedRoute);

  readonly Search = Search;
  readonly Calendar = Calendar;
  readonly Activity = Activity;
  readonly ArrowUpDown = ArrowUpDown;
  readonly Euro = Euro;
  readonly RefreshCcw = RefreshCcw;

  filterForm = this.fb.group({
    nombre: [''],
    deporte: [''],
    precioRange: [[0, 200]],
    disponibilidad: [null as Date | null],
    orden: ['']
  });

  deporteOptions$ = this.store.select(selectDeportesList).pipe(
    map(deportes => [
      { label: 'Todos', value: '' },
      ...deportes.map(d => ({ label: d.nombre, value: d.nombre }))
    ])
  );

  ordenOptions = [
    { label: 'Predeterminado', value: '' },
    { label: 'Precio: Menor a Mayor', value: 'precio_asc' },
    { label: 'Precio: Mayor a Menor', value: 'precio_desc' },
    { label: 'Nombre: A-Z', value: 'nombre_asc' }
  ];

  /** Fecha minima para el calendario (hoy) */
  readonly minDate = new Date();

  constructor(private router: Router) {
    this.store.dispatch(getDeportes());
    this.highlitFiltros();
  }

  resetFilters() {
    this.filterForm.reset({
      nombre: '',
      deporte: '',
      precioRange: [0, 200],
      disponibilidad: null,
      orden: ''
    });
    this.router.navigate(['/pistas']);
    this.store.dispatch(loadPistas({ params: {} }));
  }

  async montarRuta() {
    const filters = this.filterForm.value;
    const precioMin = filters.precioRange ? filters.precioRange[0] : null;
    const precioMax = filters.precioRange ? filters.precioRange[1] : null;

    // Formateamos la fecha a yyyy-MM-dd (formato esperado por el backend)
    let disponibilidad: string | undefined;
    if (filters.disponibilidad) {
      const d = filters.disponibilidad;
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      disponibilidad = `${year}-${month}-${day}`;
    }

    //Montamos la ruta con los filtros
    const params = {
      Nombre: filters.nombre || undefined,
      Deporte: filters.deporte || undefined,
      PrecioMin: precioMin || undefined,
      PrecioMax: precioMax || undefined,
      Disponibilidad: disponibilidad,
      Orden: filters.orden || undefined
    };
    this.router.navigate(['/pistas'], { queryParams: params });

    this.store.dispatch(loadPistas({ params }));
  }

  onSubmit() {
    this.montarRuta();
  }

  highlitFiltros() {
    const queryParams = this.route.snapshot.queryParams;

    const nombre = queryParams['Nombre'];
    const deporte = queryParams['Deporte'];

    const disponibilidad = queryParams['Disponibilidad'];
    const precioMin = queryParams['PrecioMin'] ? Number(queryParams['PrecioMin']) : 0;
    const precioMax = queryParams['PrecioMax'] ? Number(queryParams['PrecioMax']) : 200;

    const orden = queryParams['Orden'];

    this.filterForm.patchValue({
      nombre: nombre || '',
      deporte: deporte || '',
      precioRange: [precioMin, precioMax],
      disponibilidad: disponibilidad ? new Date(disponibilidad) : null,
      orden: orden || ''
    });
  }

}
