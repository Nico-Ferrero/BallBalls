import { Component, input, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { Store } from '@ngrx/store';
import { updateProfile } from '../../store/actions';
import { logout, logoutAll } from '../../../auth/store/actions';
import { ProfileResponse } from '../../../../core/interfaces/Users/ProfileResponse.interface';
import { UpdateUserRequest } from '../../../../core/interfaces/Users/UserRequest.interface';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-profile-settings',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, DialogModule, InputTextModule],
    templateUrl: './profile-settings.component.html',
    styleUrls: ['./profile-settings.component.css']
})
export class ProfileSettingsComponent {
    profile = input<ProfileResponse | null | undefined>();

    showDialog = false;
    private fb = inject(FormBuilder);
    private store = inject(Store);

    updateForm = this.fb.nonNullable.group({
        username: [''],
        nombre: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: [''],
        fotoPerfil: ['']
    });

    openEditDialog() {
        const p = this.profile();
        if (p) {
            this.updateForm.patchValue({
                username: p.username || '',
                nombre: p.nombre || p.username,
                email: p.email,
                password: '',
                fotoPerfil: p.fotoPerfil || ''
            });
        }
        this.showDialog = true;
    }

    closeEditDialog() {
        this.showDialog = false;
    }

    onSubmitUpdate() {
        if (this.updateForm.valid) {
            const formValue = this.updateForm.getRawValue();

            const updateRequest: UpdateUserRequest = {
                nombre: formValue.nombre,
                email: formValue.email
            };

            if (formValue.username) {
                updateRequest.username = formValue.username;
            }
            if (formValue.password) {
                updateRequest.password = formValue.password;
            }
            if (formValue.fotoPerfil) {
                updateRequest.fotoPerfil = formValue.fotoPerfil;
            }

            this.store.dispatch(updateProfile({ request: updateRequest }));
            this.closeEditDialog();
        }
    }

    async confirmLogoutAll() {
        const result = await Swal.fire({
            title: '¿Cerrar sesión en todos los dispositivos?',
            text: "Tendrás que volver a iniciar sesión en este dispositivo posteriormente.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#3b82f6',
            confirmButtonText: 'Sí, cerrar sesión',
            cancelButtonText: 'Cancelar',
            background: '#1e1e2d',
            color: '#fff'
        });

        if (result.isConfirmed) {
            this.store.dispatch(logoutAll());
        }
    }

    async confirmLogout() {
        const result = await Swal.fire({
            title: '¿Cerrar sesión?',
            text: "¿Estás seguro que deseas desconectarte?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#3b82f6',
            confirmButtonText: 'Sí, cerrar sesión',
            cancelButtonText: 'Cancelar',
            background: '#1e1e2d',
            color: '#fff'
        });

        if (result.isConfirmed) {
            this.store.dispatch(logout());
        }
    }
}
