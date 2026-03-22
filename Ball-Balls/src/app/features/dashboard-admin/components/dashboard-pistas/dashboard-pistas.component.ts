import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { CalendarModule } from 'primeng/calendar';
import {
  createDashboardAdminPista,
  loadDashboardAdminDeportes,
  loadDashboardAdminPistas,
  toggleDashboardAdminPista,
  updateDashboardAdminPista
} from '../../store/actions';
import {
  selectDashboardAdminDeportes,
  selectDashboardAdminPistas,
  selectDashboardAdminPistasError,
  selectDashboardAdminPistasLoading
} from '../../store/selectors';
import { Pista } from '../../../../core/interfaces/Pistas/Pistas.Interface';
import { Deporte } from '../../../../core/interfaces/Deportes/Deportes.Interface';
import Swal from 'sweetalert2';

interface SelectOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-dashboard-pistas',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    InputTextareaModule,
    DropdownModule,
    MultiSelectModule,
    CalendarModule
  ],
  templateUrl: './dashboard-pistas.component.html',
  styleUrl: './dashboard-pistas.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardPistasComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  pageNumber = 1;
  pageSize = 6;
  dialogVisible = false;
  editingSlug: string | null = null;
  editingIsActive = true;
  formSubmitted = false;

  readonly filterForm = this.fb.group({
    Nombre: [''],
    Deporte: [''],
    Disponibilidad: [null as Date | null],
    PrecioMin: [''],
    PrecioMax: ['']
  });

  readonly form = this.fb.group({
    nombre: ['', [Validators.required, Validators.maxLength(100)]],
    descripcion: ['', [Validators.required]],
    imagen: ['', [Validators.required]],
    precio: [0, [Validators.required, Validators.min(0)]],
    deportes: this.fb.control<string[] | null>(null, { validators: [Validators.required] }),
    tipoPista: [''],
    estado: [''],
    idTipoPista: ['', [Validators.required]],
    idClub: ['club-default'],
    idEstado: ['', [Validators.required]]
  });

  readonly deportesData = this.store.selectSignal(selectDashboardAdminDeportes);
  readonly pistasData = this.store.selectSignal(selectDashboardAdminPistas);
  readonly isLoading = this.store.selectSignal(selectDashboardAdminPistasLoading);
  readonly error = this.store.selectSignal(selectDashboardAdminPistasError);

  get totalPages(): number {
    return this.pistasData()?.totalPages ?? 1;
  }

  ngOnInit(): void {
    this.store.dispatch(loadDashboardAdminDeportes());

    const query = this.route.snapshot.queryParamMap;
    const pageParam = Number(query.get('page'));
    this.pageNumber = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;

    const disponibilidad = query.get('Disponibilidad');
    this.filterForm.patchValue({
      Nombre: query.get('Nombre') ?? '',
      Deporte: query.get('Deporte') ?? '',
      PrecioMin: query.get('PrecioMin') ?? '',
      PrecioMax: query.get('PrecioMax') ?? '',
      Disponibilidad: disponibilidad ? new Date(disponibilidad) : null
    });

    this.loadPage(this.pageNumber);
  }

  reload(): void {
    this.loadPage(this.pageNumber);
  }

  applyFilters(): void {
    this.pageNumber = 1;
    this.syncQueryParams();
    this.loadPage(1);
  }

  clearFilters(): void {
    this.filterForm.reset({
      Nombre: '',
      Deporte: '',
      Disponibilidad: null,
      PrecioMin: '',
      PrecioMax: ''
    });
    this.pageNumber = 1;
    this.syncQueryParams();
    this.loadPage(1);
  }

  changePage(nextPage: number): void {
    if (nextPage < 1 || nextPage > this.totalPages) {
      return;
    }

    this.pageNumber = nextPage;
    this.syncQueryParams();
    this.loadPage(nextPage);
  }

  openCreateDialog(): void {
    this.editingSlug = null;
    this.editingIsActive = true;
    this.formSubmitted = false;
    this.form.reset({
      nombre: '',
      descripcion: '',
      imagen: '',
      precio: 0,
      deportes: null,
      tipoPista: '',
      estado: '',
      idTipoPista: '',
      idClub: 'club-default',
      idEstado: ''
    });
    this.dialogVisible = true;
  }

  openEditDialog(pista: Pista): void {
    if (!pista.slug) return;
    this.editingSlug = pista.slug;
    this.editingIsActive = pista.isActive;
    this.formSubmitted = false;
    this.form.reset({
      nombre: pista.nombre ?? '',
      descripcion: pista.descripcion ?? '',
      imagen: pista.imagen ?? '',
      precio: pista.precio ?? 0,
      deportes: pista.deportes ?? null,
      tipoPista: pista.tipoPista ?? '',
      estado: pista.estado ?? '',
      idTipoPista: pista.tipoPista ?? '',
      idClub: 'club-default',
      idEstado: pista.estado ?? ''
    });
    this.dialogVisible = true;
  }

  closeDialog(): void {
    this.dialogVisible = false;
    this.formSubmitted = false;
  }

  save(): void {
    this.formSubmitted = true;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const nombre = this.form.value.nombre?.trim() ?? '';
    const descripcion = this.form.value.descripcion?.trim() || null;
    const imagen = this.form.value.imagen?.trim() || null;
    const precio = Number(this.form.value.precio ?? 0);
    const deportes = this.toSelectedList(this.form.value.deportes);
    const tipoPista = this.form.value.tipoPista?.trim() || this.form.value.idTipoPista?.trim() || null;
    const estado = this.form.value.estado?.trim() || this.form.value.idEstado?.trim() || null;
    const idTipoPista = this.form.value.idTipoPista?.trim() || null;
    const idClub = this.form.value.idClub?.trim() || null;
    const idEstado = this.form.value.idEstado?.trim() || null;

    if (!this.editingSlug) {
      this.store.dispatch(
        createDashboardAdminPista({
          request: {
            nombre,
            descripcion,
            imagen,
            precio,
            deportes,
            idTipoPista,
            idClub,
            idEstado,
            isActive: true
          }
        })
      );
    } else {
      this.store.dispatch(
        updateDashboardAdminPista({
          slug: this.editingSlug,
          request: {
            slug: this.editingSlug,
            nombre,
            descripcion,
            imagen,
            precio,
            deportes,
            tipoPista: tipoPista ?? '',
            estado: estado ?? '',
            isActive: this.editingIsActive
          }
        })
      );
    }

    this.dialogVisible = false;
  }

  async toggleActive(pista: Pista): Promise<void> {
    if (!pista.slug) return;

    if (pista.isActive) {
      const result = await Swal.fire({
        title: 'Desactivar pista',
        text: `Se desactivara ${pista.nombre ?? 'esta pista'}.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Desactivar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#E63946'
      });

      if (!result.isConfirmed) return;
    }

    this.store.dispatch(
      toggleDashboardAdminPista({
        slug: pista.slug,
        request: {
          slug: pista.slug,
          isActive: !pista.isActive
        }
      })
    );
  }

  formatDeportes(pista: Pista): string {
    return pista.deportes?.filter(Boolean).join(', ') || 'Sin deportes';
  }

  get deportesFilterOptions(): SelectOption[] {
    return this.toOptions((this.deportesData()?.items ?? []).map((item: Deporte) => item.nombre?.trim() ?? '').filter(Boolean));
  }

  get deportesOptions(): SelectOption[] {
    const fromCatalog = (this.deportesData()?.items ?? []).map((item: Deporte) => item.nombre?.trim() ?? '').filter(Boolean);
    const fromPistas =
      this.pistasData()?.items
        .flatMap((item) => item.deportes ?? [])
        .map((item) => item?.trim() ?? '')
        .filter(Boolean) ?? [];

    return this.toOptions([...fromCatalog, ...fromPistas]);
  }

  get tipoPistaOptions(): SelectOption[] {
    const fallback = ['interior', 'exterior', 'cubierta'];
    const tipoValues =
      this.pistasData()?.items
        .map((item) => item.tipoPista?.trim() ?? '')
        .filter(Boolean) ?? [];

    return this.toOptions([...fallback, ...tipoValues]);
  }

  get estadoOptions(): SelectOption[] {
    const fallback = ['disponible', 'mantenimiento', 'reservada'];
    const estadoValues =
      this.pistasData()?.items
        .map((item) => item.estado?.trim() ?? '')
        .filter(Boolean) ?? [];

    return this.toOptions([...fallback, ...estadoValues]);
  }

  onTipoChange(value: string | null): void {
    const normalized = value?.trim() ?? '';
    this.form.patchValue({ idTipoPista: normalized, tipoPista: normalized }, { emitEvent: false });
  }

  onEstadoChange(value: string | null): void {
    const normalized = value?.trim() ?? '';
    this.form.patchValue({ idEstado: normalized, estado: normalized }, { emitEvent: false });
  }

  get nombreControl() {
    return this.form.controls.nombre;
  }

  get precioControl() {
    return this.form.controls.precio;
  }

  get deportesControl() {
    return this.form.controls.deportes;
  }

  get idTipoPistaControl() {
    return this.form.controls.idTipoPista;
  }

  get idEstadoControl() {
    return this.form.controls.idEstado;
  }

  private loadPage(pageNumber: number): void {
    this.pageNumber = pageNumber;

    const filters = this.getActiveFilters();
    this.store.dispatch(
      loadDashboardAdminPistas({
        pageNumber,
        pageSize: this.pageSize,
        ...filters
      })
    );
  }

  private syncQueryParams(): void {
    const filters = this.getActiveFilters();
    const queryParams = {
      ...filters,
      page: this.pageNumber > 1 ? this.pageNumber : null
    };

    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: ''
    });
  }

  private getActiveFilters(): {
    Nombre?: string;
    Deporte?: string;
    PrecioMin?: number;
    PrecioMax?: number;
    Disponibilidad?: string;
  } {
    const nombre = this.filterForm.controls.Nombre.value?.trim() ?? '';
    const deporte = this.filterForm.controls.Deporte.value?.trim() ?? '';
    const precioMinRaw = this.filterForm.controls.PrecioMin.value?.trim() ?? '';
    const precioMaxRaw = this.filterForm.controls.PrecioMax.value?.trim() ?? '';
    const disponibilidad = this.toApiDate(this.filterForm.controls.Disponibilidad.value);

    const precioMin = precioMinRaw ? Number(precioMinRaw) : undefined;
    const precioMax = precioMaxRaw ? Number(precioMaxRaw) : undefined;

    return {
      ...(nombre ? { Nombre: nombre } : {}),
      ...(deporte ? { Deporte: deporte } : {}),
      ...(Number.isFinite(precioMin as number) ? { PrecioMin: precioMin } : {}),
      ...(Number.isFinite(precioMax as number) ? { PrecioMax: precioMax } : {}),
      ...(disponibilidad ? { Disponibilidad: disponibilidad } : {})
    };
  }

  private toApiDate(value: Date | null): string | undefined {
    if (!value) {
      return undefined;
    }

    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, '0');
    const day = String(value.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private toSelectedList(values: string[] | null | undefined): string[] | null {
    const selected = (values ?? []).map((item) => item?.trim() ?? '').filter(Boolean);
    return selected.length ? selected : null;
  }

  private toOptions(values: string[]): SelectOption[] {
    const uniqueValues = Array.from(new Set(values));
    return uniqueValues.map((value) => ({ label: value, value }));
  }
}
