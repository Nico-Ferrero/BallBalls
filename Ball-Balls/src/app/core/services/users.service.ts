import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ProfileResponse } from '../interfaces/Users/ProfileResponse.interface';
import { UpdateUserRequest } from '../interfaces/Users/UserRequest.interface';

@Injectable({
    providedIn: 'root'
})
export class UsersService {
    private http = inject(HttpClient);
    private readonly baseUrl = 'http://localhost:5282/api/User';

    /**
     * Obtener el usuario actual logueado
     */
    getCurrentUser(): Observable<ProfileResponse> {
        return this.http.get<ProfileResponse>(`${this.baseUrl}`, { withCredentials: true });
    }

    /**
     * Actualizar el usuario actual logueado
     */
    updateCurrentUser(request: UpdateUserRequest): Observable<ProfileResponse> {
        return this.http.put<{ message: string, user: ProfileResponse }>(`${this.baseUrl}`, request, { withCredentials: true }).pipe(
            map(response => response.user)
        );
    }
}
