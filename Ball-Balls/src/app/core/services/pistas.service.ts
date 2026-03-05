import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiService } from './api.service';
import { Pista, PistasResponse } from '../interfaces/Pistas/Pistas.Interface';
import {
    PistasQueryParams,
    CreatePistaRequest,
    UpdatePistaRequest,
    SoftDeletePistaRequest
} from '../interfaces/Pistas/PistasRequests.Interface';

@Injectable({
    providedIn: 'root'
})
export class PistasService {
    private readonly http = inject(HttpClient);
    private readonly api = inject(ApiService);
    private readonly baseUrl = environment.apiUrl;
    private readonly endpoint = 'api/Pistas';

    /**
     * Obtener pistas con paginación y filtros
     * @param params - Parámetros de búsqueda y paginación
     */
    getPistas(params?: PistasQueryParams): Observable<PistasResponse> {
        let httpParams = new HttpParams();

        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== null && value !== undefined) {
                    httpParams = httpParams.set(key, String(value));
                }
            });
        }

        return this.http.get<PistasResponse>(`${this.baseUrl}/${this.endpoint}`, { params: httpParams });
    }

    /**
     * Obtener una pista por su ID/Slug
     * @param id - ID o Slug de la pista
     */
    getPistaById(id: string): Observable<Pista> {
        return this.api.get<Pista>(`${this.endpoint}/${id}`);
    }

    /**
     * Crear una nueva pista
     * @param request - Datos de la pista a crear
     */
    createPista(request: CreatePistaRequest): Observable<Pista> {
        return this.api.post<Pista>(this.endpoint, { body: request });
    }

    /**
     * Actualizar una pista existente
     * @param slug - Slug de la pista a actualizar
     * @param request - Datos actualizados de la pista
     */
    updatePista(slug: string, request: UpdatePistaRequest): Observable<Pista> {
        return this.api.put<Pista>(`${this.endpoint}/${slug}`, { body: request });
    }

    /**
     * Soft delete de una pista (cambiar isActive)
     * @param slug - Slug de la pista
     * @param request - Datos de la solicitud de soft delete
     */
    softDeletePista(slug: string, request: SoftDeletePistaRequest): Observable<Pista> {
        return this.api.patch<Pista>(`${this.endpoint}/${slug}`, { body: request });
    }
}
