import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Reserva, ReservasResponse } from '../interfaces/Reservas/Reservas.Interface';
import {
    CreateReservaRequest,
    UpdateReservaRequest,
    PaymentIntentResponse
} from '../interfaces/Reservas/ReservasRequests.Interface';

@Injectable({
    providedIn: 'root'
})
export class ReservasService {
    private readonly api = inject(ApiService);
    private readonly endpoint = 'api/Reservas';

    /**
     * Obtener todas las reservas
     */
    getReservas(): Observable<ReservasResponse> {
        return this.api.get<ReservasResponse>(this.endpoint);
    }

    /**
     * Obtener reservas por fecha
     * @param fecha - Fecha en formato string
     */
    getReservasByDate(fecha: string): Observable<ReservasResponse> {
        return this.api.get<ReservasResponse>(`${this.endpoint}/date/${fecha}`);
    }

    /**
     * Obtener una reserva por su PublicId
     * @param publicId - PublicId de la reserva
     */
    getReservaById(publicId: string): Observable<Reserva> {
        return this.api.get<Reserva>(`${this.endpoint}/${publicId}`);
    }

    /**
     * Crear un PaymentIntent y una Reserva PENDING
     */
    createPaymentIntent(request: CreateReservaRequest): Observable<PaymentIntentResponse> {
        return this.api.post<PaymentIntentResponse>(`${this.endpoint}/create-payment-intent`, request);
    }

    /**
     * Obtener reservas bloqueadas por ID o Slug de Pista
     */
    getReservasByPista(pistaId: string): Observable<ReservasResponse> {
        return this.api.get<ReservasResponse>(`${this.endpoint}/pista/${pistaId}`);
    }

    /**
     * Obtener reservas de un usuario
     * @param usuarioId - ID del usuario
     */
    getReservasByUsuario(usuarioId: string): Observable<ReservasResponse> {
        return this.api.get<ReservasResponse>(`${this.endpoint}/usuario/${usuarioId}`);
    }

    /**
     * Crear una nueva reserva directamente (obsoleto si usamos createPaymentIntent)
     * @param request - Datos de la reserva a crear
     */
    createReserva(request: CreateReservaRequest): Observable<Reserva> {
        return this.api.post<Reserva>(this.endpoint, request);
    }

    /**
     * Actualizar una reserva existente
     * @param publicId - PublicId de la reserva a actualizar
     * @param request - Datos actualizados de la reserva
     */
    updateReserva(publicId: string, request: UpdateReservaRequest): Observable<Reserva> {
        return this.api.put<Reserva>(`${this.endpoint}/${publicId}`, request);
    }

    /**
     * Cancelar/eliminar una reserva (soft delete)
     * @param publicId - PublicId de la reserva a cancelar
     */
    cancelReserva(publicId: string): Observable<void> {
        return this.api.patch<void>(`${this.endpoint}/${publicId}`, {});
    }
}
