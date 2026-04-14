export interface UserPreferenceProfile {
    /** Franja horaria favorita en texto: "tarde (16-20h)" */
    franjaFavorita: string;
    /** Tipo de pista más reservado, o null si no hay datos */
    tipoFavorito: string | null;
    /** Duración media de reservas en minutos */
    duracionMedia: number;
    /** Nombre/slug de la pista más reservada */
    pistaMasFrecuente: string | null;
}

export interface ZeroShotResult {
    sequence: string;
    labels: string[];
    scores: number[];
}
