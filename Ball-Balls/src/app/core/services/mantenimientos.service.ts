import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Mantenimiento, MantenimientosResponse } from '../interfaces/Mantenimientos/Mantenimientos.Interface';
import {
    CreateMantenimientoRequest,
    UpdateMantenimientoRequest
} from '../interfaces/Mantenimientos/MantenimientosRequests.Interface';

@Injectable({
    providedIn: 'root'
})
export class MantenimientosService {
    private readonly api = inject(ApiService);
    private readonly endpoint = 'api/Mantenimiento';

    /**
     * Obtener todos los mantenimientos
     */
    getMantenimientos(): Observable<MantenimientosResponse> {
        return this.api.get<MantenimientosResponse>(this.endpoint);
    }

    /**
     * Obtener un mantenimiento por su PublicId
     * @param publicId - PublicId del mantenimiento
     */
    getMantenimientoById(publicId: string): Observable<Mantenimiento> {
        return this.api.get<Mantenimiento>(`${this.endpoint}/${publicId}`);
    }

    /**
     * Crear un nuevo mantenimiento
     * @param request - Datos del mantenimiento a crear
     */
    createMantenimiento(request: CreateMantenimientoRequest): Observable<Mantenimiento> {
        return this.api.post<Mantenimiento>(this.endpoint, request);
    }

    /**
     * Actualizar un mantenimiento existente
     * @param publicId - PublicId del mantenimiento a actualizar
     * @param request - Datos actualizados del mantenimiento
     */
    updateMantenimiento(publicId: string, request: UpdateMantenimientoRequest): Observable<Mantenimiento> {
        return this.api.put<Mantenimiento>(`${this.endpoint}/${publicId}`, request);
    }
}
