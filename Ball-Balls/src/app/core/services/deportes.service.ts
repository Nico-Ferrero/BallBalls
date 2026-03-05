import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Deporte, DeportesResponse } from '../interfaces/Deportes/Deportes.Interface';
import {
    CreateDeporteRequest,
    UpdateDeporteRequest,
    SoftDeleteDeporteRequest
} from '../interfaces/Deportes/DeportesRequests.Interface';

@Injectable({
    providedIn: 'root'
})
export class DeportesService {
    private readonly api = inject(ApiService);
    private readonly endpoint = 'api/Deportes';

    /**
     * Obtener todos los deportes
     */
    getDeportes(): Observable<DeportesResponse> {
        return this.api.get<DeportesResponse>(this.endpoint);
    }

    /**
     * Obtener un deporte por su ID/Slug
     * @param id - ID o Slug del deporte
     */
    getDeporteById(id: string): Observable<Deporte> {
        return this.api.get<Deporte>(`${this.endpoint}/${id}`);
    }

    /**
     * Crear un nuevo deporte
     * @param request - Datos del deporte a crear
     */
    createDeporte(request: CreateDeporteRequest): Observable<Deporte> {
        return this.api.post<Deporte>(this.endpoint, { body: request });
    }

    /**
     * Actualizar un deporte existente
     * @param slug - Slug del deporte a actualizar
     * @param request - Datos actualizados del deporte
     */
    updateDeporte(slug: string, request: UpdateDeporteRequest): Observable<Deporte> {
        return this.api.put<Deporte>(`${this.endpoint}/${slug}`, { body: request });
    }

    /**
     * Soft delete de un deporte (cambiar isActive)
     * @param slug - Slug del deporte
     * @param request - Datos de la solicitud de soft delete
     */
    softDeleteDeporte(slug: string, request: SoftDeleteDeporteRequest): Observable<Deporte> {
        return this.api.patch<Deporte>(`${this.endpoint}/${slug}`, { body: request });
    }
}
