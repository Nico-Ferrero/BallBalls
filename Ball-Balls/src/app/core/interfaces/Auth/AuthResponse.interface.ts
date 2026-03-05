export interface AuthResponse {
    accessToken: string;
    usuario: UsuarioResponse;
}

export interface RefreshResponse {
    accessToken: string;
    usuario: UsuarioResponse;
}

export interface RegisterResponse {
    mensaje: string;
}

export interface UsuarioResponse {
    username: string;
    nombre: string;
    email: string;
    fotoPerfil: string;
    fechaRegistro: string; // ISO 8601 string mapping DateTime
    activo: boolean; // Note: Activo is boolean in ASP.NET but boolean in TS
}
