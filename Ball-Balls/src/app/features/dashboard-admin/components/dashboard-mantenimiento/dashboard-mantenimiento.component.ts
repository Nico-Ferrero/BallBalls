import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  computed,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import Swal from 'sweetalert2';
import {
  createDashboardAdminMantenimiento,
  loadDashboardAdminMantenimientos,
  loadDashboardAdminPistas,
  toggleDashboardAdminMantenimiento,
  updateDashboardAdminMantenimiento
} from '../../store/actions';
import {
  selectDashboardAdminMantenimientos,
  selectDashboardAdminMantenimientosError,
  selectDashboardAdminMantenimientosLoading,
  selectDashboardAdminPistas
} from '../../store/selectors';
import { Mantenimiento } from '../../../../core/interfaces/Mantenimientos/Mantenimientos.Interface';
import { revealOnView } from '../../shared/motion.util';

interface PistaOption {
  label: string;
  value: string;
}

interface MantenimientoFilters {
  pista: string;
  estado: 'todos' | 'activos' | 'inactivos';
  desde: Date | null;
}

@Component({
  selector: 'app-dashboard-mantenimiento',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    InputTextareaModule,
    CalendarModule,
    DropdownModule
  ],
  templateUrl: './dashboard-mantenimiento.component.html',
  styleUrl: './dashboard-mantenimiento.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardMantenimientoComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly store = inject(Store);
  private readonly fb = inject(FormBuilder);

  @ViewChild('host', { static: true }) hostRef!: ElementRef<HTMLElement>;
  private stopReveal: () => void = () => undefined;

  dialogVisible = false;
  editingId: string | null = null;
  editingIsActive = true;
  formSubmitted = false;

  readonly mantenimientosData = this.store.selectSignal(selectDashboardAdminMantenimientos);
  readonly isLoading = this.store.selectSignal(selectDashboardAdminMantenimientosLoading);
  readonly error = this.store.selectSignal(selectDashboardAdminMantenimientosError);
  readonly pistasData = this.store.selectSignal(selectDashboardAdminPistas);

  readonly filterForm = this.fb.group({
    pista: [''],
    estado: ['todos' as MantenimientoFilters['estado']],
    desde: [null as Date | null]
  });

  readonly form = this.fb.group({
    slugPista: ['', [Validators.required]],
    fechaMantenimiento: [null as Date | null, [Validators.required]],
    horaInicioMantenimiento: ['', [Validators.required]],
    horaFinMantenimiento: ['', [Validators.required]],
    descripcionMantenimiento: ['']
  });

  readonly filtered = computed(() => {
    const data = this.mantenimientosData();
    if (!data) return [];
    const items = data.items ?? [];
    const filters = this.filterForm.getRawValue() as MantenimientoFilters;

    return items.filter((m) => {
      if (filters.pista && (m.slugPista ?? '') !== filters.pista) return false;
      if (filters.estado === 'activos' && !m.isActive) return false;
      if (filters.estado === 'inactivos' && m.isActive) return false;
      if (filters.desde && m.fecha) {
        const fechaMant = new Date(m.fecha).getTime();
        const fechaDesde = filters.desde.getTime();
        if (Number.isFinite(fechaMant) && fechaMant < fechaDesde) return false;
      }
      return true;
    });
  });

  readonly metrics = computed(() => {
    const items = this.mantenimientosData()?.items ?? [];
    const total = items.length;
    const activos = items.filter((m) => m.isActive).length;
    const inactivos = total - activos;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const futuros = items.filter((m) => {
      if (!m.fecha) return false;
      const d = new Date(m.fecha);
      d.setHours(0, 0, 0, 0);
      return d.getTime() >= today.getTime();
    }).length;
    return { total, activos, inactivos, futuros };
  });

  get pistaOptions(): PistaOption[] {
    const items = this.pistasData()?.items ?? [];
    return items
      .filter((p) => !!p.slug)
      .map((p) => ({ label: p.nombre ?? p.slug ?? '-', value: p.slug as string }));
  }

  get estadoOptions(): Array<{ label: string; value: MantenimientoFilters['estado'] }> {
    return [
      { label: 'Todos', value: 'todos' },
      { label: 'Activos', value: 'activos' },
      { label: 'Inactivos', value: 'inactivos' }
    ];
  }

  get slugPistaControl() { return this.form.controls.slugPista; }
  get fechaControl() { return this.form.controls.fechaMantenimiento; }
  get horaInicioControl() { return this.form.controls.horaInicioMantenimiento; }
  get horaFinControl() { return this.form.controls.horaFinMantenimiento; }

  ngOnInit(): void {
    this.store.dispatch(loadDashboardAdminMantenimientos());
    this.store.dispatch(loadDashboardAdminPistas({ pageNumber: 1, pageSize: 50 }));
  }

  ngAfterViewInit(): void {
    queueMicrotask(() => {
      this.stopReveal = revealOnView(this.hostRef.nativeElement);
    });
  }

  ngOnDestroy(): void {
    this.stopReveal();
  }

  reload(): void {
    this.store.dispatch(loadDashboardAdminMantenimientos());
  }

  clearFilters(): void {
    this.filterForm.reset({ pista: '', estado: 'todos', desde: null });
  }

  openCreateDialog(): void {
    this.editingId = null;
    this.editingIsActive = true;
    this.formSubmitted = false;
    this.form.reset({
      slugPista: '',
      fechaMantenimiento: null,
      horaInicioMantenimiento: '',
      horaFinMantenimiento: '',
      descripcionMantenimiento: ''
    });
    this.dialogVisible = true;
  }

  openEditDialog(m: Mantenimiento): void {
    if (!m.publicId) return;
    this.editingId = m.publicId;
    this.editingIsActive = m.isActive;
    this.formSubmitted = false;
    this.form.reset({
      slugPista: m.slugPista ?? '',
      fechaMantenimiento: m.fecha ? new Date(m.fecha) : null,
      horaInicioMantenimiento: m.horaInicio ?? '',
      horaFinMantenimiento: m.horaFin ?? '',
      descripcionMantenimiento: m.descripcion ?? ''
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

    const v = this.form.getRawValue();
    const fechaISO = v.fechaMantenimiento ? this.toApiDate(v.fechaMantenimiento) : '';

    if (!this.editingId) {
      this.store.dispatch(
        createDashboardAdminMantenimiento({
          request: {
            slugPista: v.slugPista || null,
            fechaMantenimiento: fechaISO,
            horaInicioMantenimiento: v.horaInicioMantenimiento || null,
            horaFinMantenimiento: v.horaFinMantenimiento || null,
            descripcionMantenimiento: v.descripcionMantenimiento || null
          }
        })
      );
    } else {
      this.store.dispatch(
        updateDashboardAdminMantenimiento({
          publicId: this.editingId,
          request: {
            slugPista: v.slugPista || null,
            fechaMantenimiento: fechaISO,
            horaInicioMantenimiento: v.horaInicioMantenimiento || null,
            horaFinMantenimiento: v.horaFinMantenimiento || null,
            descripcionMantenimiento: v.descripcionMantenimiento || null,
            isActive: this.editingIsActive
          }
        })
      );
    }

    this.dialogVisible = false;
  }

  async toggleActive(m: Mantenimiento): Promise<void> {
    if (!m.publicId) return;

    if (m.isActive) {
      const result = await Swal.fire({
        title: 'Desactivar mantenimiento',
        text: `Se marcará como inactivo el mantenimiento de ${m.nombrePista ?? 'esta pista'}.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Desactivar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#E63946'
      });
      if (!result.isConfirmed) return;
    }

    this.store.dispatch(
      toggleDashboardAdminMantenimiento({
        publicId: m.publicId,
        request: {
          slugPista: m.slugPista ?? null,
          fechaMantenimiento: m.fecha ?? '',
          horaInicioMantenimiento: m.horaInicio ?? null,
          horaFinMantenimiento: m.horaFin ?? null,
          descripcionMantenimiento: m.descripcion ?? null,
          isActive: !m.isActive
        }
      })
    );
  }

  trackById = (_: number, m: Mantenimiento) => m.publicId ?? `${m.fecha}-${m.slugPista}`;

  pillClass(m: Mantenimiento): string {
    if (!m.isActive) return 'pill pill--neutral';
    const estado = (m.estado ?? '').toLowerCase();
    if (estado.includes('progreso')) return 'pill pill--warning';
    if (estado.includes('completado') || estado.includes('finaliz')) return 'pill pill--success';
    return 'pill pill--info';
  }

  formatHora(value: string | null): string {
    if (!value) return '-';
    return value.length > 5 ? value.slice(0, 5) : value;
  }

  private toApiDate(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }
}
