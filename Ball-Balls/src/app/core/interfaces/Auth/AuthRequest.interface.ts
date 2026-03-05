export interface LoginRequest {
    email: string;
    password?: string;
    deviceId?: string;
}

export interface RegisterRequest {
    username: string;
    nombre: string;
    email: string;
    password?: string;
}

export interface LogoutRequest {
    tipoLogOut: 'En este dispositivo' | 'Cerrar todas las sesiones';
}
