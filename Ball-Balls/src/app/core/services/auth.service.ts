import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { LoginRequest, RegisterRequest, LogoutRequest } from '../interfaces/Auth/AuthRequest.interface';
import { AuthResponse, RefreshResponse, RegisterResponse, UsuarioResponse } from '../interfaces/Auth/AuthResponse.interface';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private http = inject(HttpClient);
    private router = inject(Router);
    private readonly baseUrl = 'http://localhost:5282/api/Auth';

    // Perfil global en Auth (segun requiera arquitecturas de Signals)
    public currentUser = signal<UsuarioResponse | null>(null);
    private accessTokenSignal = signal<string | null>(null);

    /**
     * Login - Almacena Access Token y retorna AuthResponse
     */
    login(request: LoginRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.baseUrl}/login`, request, { withCredentials: true }).pipe(
            tap(response => {
                this.setAccessToken(response.accessToken);
                this.currentUser.set(response.usuario);
                this.broadcastSessionChange('login');
            })
        );
    }

    /**
     * Register
     */
    register(request: RegisterRequest): Observable<RegisterResponse> {
        return this.http.post<RegisterResponse>(`${this.baseUrl}/register`, request, { withCredentials: true });
    }

    /**
     * Refresh - Actualiza token local 
     */
    refresh(): Observable<RefreshResponse> {
        return this.http.post<RefreshResponse>(`${this.baseUrl}/refresh`, {}, { withCredentials: true }).pipe(
            tap(response => {
                this.setAccessToken(response.accessToken);
                this.currentUser.set(response.usuario);
            })
        );
    }

    /**
     * Logout - Borra cookie en server y limpia sesión local
     */
    logout(request: LogoutRequest = { tipoLogOut: 'En este dispositivo' }): void {
        // Best-effort logout (no nos interesa la respuesta si el token ya expiró o algo falló, queremos borrar cookie server side)
        this.http.post(`${this.baseUrl}/logout`, request, { withCredentials: true })
            .subscribe({
                next: () => this.clearLocalSession(),
                error: () => this.clearLocalSession()
            });
    }

    logoutAll(): void {
        this.logout({ tipoLogOut: 'Cerrar todas las sesiones' });
    }


    /**
   * Limpieza de sesión local compartida
   */
    clearLocalSession(): void {
        this.accessTokenSignal.set(null);
        this.currentUser.set(null);

        this.broadcastSessionChange('logout');
        this.router.navigate(['/login']);
    }

    getAccessToken(): string | null {
        return this.accessTokenSignal();
    }

    private setAccessToken(token: string): void {
        this.accessTokenSignal.set(token);
    }

    /**
     * Sincronización multi-pestaña usando BroadcastChannel
     */
    private broadcastSessionChange(action: 'login' | 'logout'): void {
        try {
            const channel = new BroadcastChannel('auth_channel');
            channel.postMessage({ action });
            channel.close();
        } catch {
            // Ignorar si el navegador no soporta BroadcastChannel
        }
    }
}
