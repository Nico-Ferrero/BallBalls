import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = environment.apiUrl;

    /**
     * GET request
     * @param endpoint - API endpoint (e.g., 'deportes', 'pistas/slug')
     * @param params - Optional query parameters
     */
    get<T>(endpoint: string, params?: Record<string, string | number | boolean>): Observable<T> {
        let httpParams = new HttpParams();

        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== null && value !== undefined) {
                    httpParams = httpParams.set(key, String(value));
                }
            });
        }

        return this.http.get<T>(`${this.baseUrl}/${endpoint}`, { params: httpParams });
    }

    /**
     * POST request
     * @param endpoint - API endpoint
     * @param body - Request body
     */
    post<T>(endpoint: string, body: unknown): Observable<T> {
        return this.http.post<T>(`${this.baseUrl}/${endpoint}`, body);
    }

    /**
     * PUT request (reemplaza el recurso completo)
     * @param endpoint - API endpoint
     * @param body - Request body
     */
    put<T>(endpoint: string, body: unknown): Observable<T> {
        return this.http.put<T>(`${this.baseUrl}/${endpoint}`, body);
    }

    /**
     * PATCH request (actualización parcial)
     * @param endpoint - API endpoint
     * @param body - Request body
     */
    patch<T>(endpoint: string, body: unknown): Observable<T> {
        return this.http.patch<T>(`${this.baseUrl}/${endpoint}`, body);
    }

    /**
     * DELETE request
     * @param endpoint - API endpoint
     */
    delete<T>(endpoint: string): Observable<T> {
        return this.http.delete<T>(`${this.baseUrl}/${endpoint}`);
    }
}
