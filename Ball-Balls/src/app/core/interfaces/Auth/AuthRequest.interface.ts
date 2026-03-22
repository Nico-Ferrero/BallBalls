export interface LoginRequest {
    email: string | null;
    password?: string | null;
    deviceId?: string | null;
}

export interface RegisterRequest {
    username: string | null;
    nombre: string | null;
    email: string | null;
    password?: string | null;
}

export interface LogoutRequest {
    tipoLogOut: 'En este dispositivo' | 'Cerrar todas las sesiones';
}
