import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import {
  createDashboardAdminDeporte,
  loadDashboardAdminDeportes,
  toggleDashboardAdminDeporte,
  updateDashboardAdminDeporte
} from '../../store/actions';
import {
  selectDashboardAdminDeportes,
  selectDashboardAdminDeportesError,
  selectDashboardAdminDeportesLoading
} from '../../store/selectors';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { Deporte } from '../../../../core/interfaces/Deportes/Deportes.Interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard-deportes',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    InputTextareaModule
  ],
  templateUrl: './dashboard-deportes.component.html',
  styleUrl: './dashboard-deportes.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardDeportesComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly fb = inject(FormBuilder);

  dialogVisible = false;
  editingSlug: string | null = null;
  editingIsActive = true;
  formSubmitted = false;

  readonly form = this.fb.group({
    nombre: ['', [Validators.required, Validators.maxLength(100)]],
    descripcion: ['']
  });

  readonly deportesData = this.store.selectSignal(selectDashboardAdminDeportes);
  readonly isLoading = this.store.selectSignal(selectDashboardAdminDeportesLoading);
  readonly error = this.store.selectSignal(selectDashboardAdminDeportesError);

  ngOnInit(): void {
    this.store.dispatch(loadDashboardAdminDeportes());
  }

  openCreateDialog(): void {
    this.editingSlug = null;
    this.editingIsActive = true;
    this.formSubmitted = false;
    this.form.reset({ nombre: '', descripcion: '' });
    this.dialogVisible = true;
  }

  openEditDialog(deporte: Deporte): void {
    if (!deporte.slug) return;
    this.editingSlug = deporte.slug;
    this.editingIsActive = deporte.isActive;
    this.formSubmitted = false;
    this.form.reset({
      nombre: deporte.nombre ?? '',
      descripcion: deporte.descripcion ?? ''
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

    if (!this.editingSlug) {
      this.store.dispatch(
        createDashboardAdminDeporte({
          request: {
            nombre,
            descripcion,
            isActive: true
          }
        })
      );
    } else {
      this.store.dispatch(
        updateDashboardAdminDeporte({
          slug: this.editingSlug,
          request: {
            slug: this.editingSlug,
            nombre,
            descripcion,
            isActive: this.editingIsActive
          }
        })
      );
    }

    this.dialogVisible = false;
  }

  async toggleActive(deporte: Deporte): Promise<void> {
    if (!deporte.slug) return;

    if (deporte.isActive) {
      const result = await Swal.fire({
        title: 'Desactivar deporte',
        text: `Se desactivara ${deporte.nombre ?? 'este deporte'}.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Desactivar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#E63946'
      });

      if (!result.isConfirmed) return;
    }

    this.store.dispatch(
      toggleDashboardAdminDeporte({
        slug: deporte.slug,
        request: {
          slug: deporte.slug,
          isActive: !deporte.isActive
        }
      })
    );
  }

  quickUpdate(): void {
    const firstEditable = this.deportesData()?.items.find((item) => !!item.slug);
    if (firstEditable) {
      this.openEditDialog(firstEditable);
    }
  }

  quickDeactivate(): void {
    const firstActive = this.deportesData()?.items.find((item) => !!item.slug && item.isActive);
    if (firstActive) {
      void this.toggleActive(firstActive);
    }
  }

  get nombreControl() {
    return this.form.controls.nombre;
  }
}
