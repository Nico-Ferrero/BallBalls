import { AuthResponse, UsuarioResponse } from "./AuthResponse.interface";

export interface AuthStateInterface {
    isLoading: boolean;
    auth: AuthResponse | null;
    usuario: UsuarioResponse | null;
    error: string | null;
}
