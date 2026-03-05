import { Component, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

// PrimeNG UI Modules
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { MessagesModule } from 'primeng/messages';
import { Message } from 'primeng/api';
import { DividerModule } from 'primeng/divider';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';

import { Store } from '@ngrx/store';
import { login, register } from './store/actions';
import { selectAuthError, selectIsLoading } from './store/selectors';

@Component({
    selector: 'app-auth',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        InputTextModule,
        PasswordModule,
        ButtonModule,
        MessagesModule,
        DividerModule,
        CardModule,
        FloatLabelModule
    ],
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.css']
})
export class AuthComponent {
    private fb = inject(FormBuilder);
    private store = inject(Store);
    private router = inject(Router);

    isLoginView = signal<boolean>(true);
    messages = signal<Message[]>([]);

    isLoading = this.store.selectSignal(selectIsLoading);
    authError = this.store.selectSignal(selectAuthError);

    constructor() {
        // Efecto para escuchar los errores del Store y mostrar un mensaje
        effect(() => {
            const error = this.authError();
            if (error) {
                this.showError(error);
            }
        }, { allowSignalWrites: true });
    }

    loginForm: FormGroup = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required]]
    });

    registerForm: FormGroup = this.fb.group({
        nombre: ['', [Validators.required, Validators.minLength(2)]],
        username: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]]
    });

    toggleView(isLogin: boolean): void {
        this.isLoginView.set(isLogin);
        this.messages.set([]);
        this.loginForm.reset();
        this.registerForm.reset();
    }

    showError(detail: string) {
        this.messages.set([{ severity: 'error', summary: 'Error', detail }]);
    }

    onSubmit(): void {
        this.messages.set([]); // Limpiar mensajes
        if (this.isLoginView()) {
            if (this.loginForm.invalid) {
                this.loginForm.markAllAsTouched();
                return;
            }

            const loginRequest = {
                ...this.loginForm.value,
                deviceId: navigator.userAgent
            };

            this.store.dispatch(login({ request: loginRequest }));
        } else {
            if (this.registerForm.invalid) {
                this.registerForm.markAllAsTouched();
                return;
            }
            this.store.dispatch(register({ request: this.registerForm.value }));
        }
    }
}
