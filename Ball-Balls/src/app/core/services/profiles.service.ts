import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProfileResponse } from '../interfaces/Users/ProfileResponse.interface';

@Injectable({
    providedIn: 'root'
})
export class ProfilesService {
    private http = inject(HttpClient);
    private readonly baseUrl = 'http://localhost:5282/api/Profile';

    /**
     * Obtener el perfil de un usuario por su nombre de usuario
     */
    getProfile(username: string): Observable<ProfileResponse> {
        return this.http.get<ProfileResponse>(`${this.baseUrl}/${username}`, { withCredentials: true });
    }
}
