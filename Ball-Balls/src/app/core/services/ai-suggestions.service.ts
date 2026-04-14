import { inject, Injectable, signal } from '@angular/core';
import { PistasService } from './pistas.service';
import { Reserva } from '../interfaces/Reservas/Reservas.Interface';
import { Pista } from '../interfaces/Pistas/Pistas.Interface';
import { UserPreferenceProfile, ZeroShotResult } from '../interfaces/AiSuggestions.interface';

@Injectable({ providedIn: 'root' })
export class AiSuggestionsService {
    private pistasService = inject(PistasService);
    private worker: Worker | null = null;

    // ── Public state (leído por profile.component para el FAB) ──
    readonly reservasLoaded = signal(false);
    readonly suggestions = signal<Pista[]>([]);
    readonly aiLoading = signal(false);
    readonly aiError = signal(false);
    readonly dialogOpen = signal(false);

    constructor() {
        if (typeof Worker !== 'undefined') {
            this.worker = new Worker(
                new URL('../workers/ai-suggestions.worker', import.meta.url),
                { type: 'module' }
            );
        }
    }

    openDialog()  { this.dialogOpen.set(true);  }
    closeDialog() { this.dialogOpen.set(false); }

    analyzePreferences(reservas: Reserva[]): UserPreferenceProfile {
        const franjaCounts: Record<string, number> = {
            'mañana (8-12h)': 0, 'mediodía (12-16h)': 0,
            'tarde (16-20h)': 0, 'noche (20-24h)': 0,
        };
        let totalDuration = 0;
        const pistaCounts: Record<string, number> = {};
        const tipoCounts:  Record<string, number> = {};

        for (const r of reservas) {
            if (r.fechaHoraInicio) {
                const hora = new Date(r.fechaHoraInicio).getHours();
                if      (hora >= 8  && hora < 12) franjaCounts['mañana (8-12h)']++;
                else if (hora >= 12 && hora < 16) franjaCounts['mediodía (12-16h)']++;
                else if (hora >= 16 && hora < 20) franjaCounts['tarde (16-20h)']++;
                else                              franjaCounts['noche (20-24h)']++;
            }
            if (r.fechaHoraInicio && r.fechaHoraFin) {
                totalDuration += (new Date(r.fechaHoraFin).getTime() - new Date(r.fechaHoraInicio).getTime()) / 60000;
            }
            if (r.pista) pistaCounts[r.pista] = (pistaCounts[r.pista] ?? 0) + 1;
            if (r.tipo)  tipoCounts[r.tipo]   = (tipoCounts[r.tipo]  ?? 0) + 1;
        }

        const franjaFavorita     = Object.entries(franjaCounts).sort(([,a],[,b]) => b-a)[0][0];
        const pistaMasFrecuente  = Object.keys(pistaCounts).length ? Object.entries(pistaCounts).sort(([,a],[,b]) => b-a)[0][0] : null;
        const tipoFavorito       = Object.keys(tipoCounts).length  ? Object.entries(tipoCounts).sort(([,a],[,b]) => b-a)[0][0]  : null;
        const duracionMedia      = reservas.length ? Math.round(totalDuration / reservas.length) : 90;

        return { franjaFavorita, tipoFavorito, duracionMedia, pistaMasFrecuente };
    }

    loadSuggestions(reservas: Reserva[]): void {
        this.reservasLoaded.set(true);
        if (reservas.length === 0) return;

        const input     = reservas.filter(r => r.estado?.toUpperCase() === 'PAID');
        const toAnalyze = input.length > 0 ? input : reservas;
        const profile   = this.analyzePreferences(toAnalyze);

        this.aiLoading.set(true);
        this.aiError.set(false);

        if (!this.worker) { this.fetchAndRank(profile, [], []); return; }

        const candidateLabels = ['mañana (8-12h)', 'mediodía (12-16h)', 'tarde (16-20h)', 'noche (20-24h)'];
        const sequence = `Usuario que prefiere jugar en la franja de ${profile.franjaFavorita}`
            + (profile.tipoFavorito ? `, practica ${profile.tipoFavorito}` : '')
            + `, con sesiones de unos ${profile.duracionMedia} minutos.`;

        this.worker.onmessage = ({ data }) => {
            const zs: ZeroShotResult = data.result ?? { labels: candidateLabels, scores: [] };
            this.fetchAndRank(profile, zs.labels, zs.scores);
        };
        this.worker.onerror = () => this.fetchAndRank(profile, [], []);
        this.worker.postMessage({ sequence, candidateLabels });
    }

    private fetchAndRank(profile: UserPreferenceProfile, _labels: string[], _scores: number[]) {
        this.pistasService.getPistas({ PageSize: 50 }).subscribe({
            next: (response) => {
                const disponibles = response.items.filter(p => p.isActive && p.estado?.toLowerCase() !== 'ocupada');
                const scored = (p: Pista) =>
                    (profile.pistaMasFrecuente && p.slug === profile.pistaMasFrecuente ? 2 : 0) +
                    (profile.tipoFavorito && p.tipoPista?.toLowerCase() === profile.tipoFavorito?.toLowerCase() ? 1 : 0);
                const ranked = [...disponibles].sort((a, b) => scored(b) - scored(a));
                this.suggestions.set(ranked.slice(0, 5));
                this.aiLoading.set(false);
                console.log('[AI] Sugerencias:', ranked.slice(0, 5).map(p => p.nombre));
            },
            error: (err) => {
                console.error('[AI] Error:', err);
                this.aiLoading.set(false);
                this.aiError.set(true);
            }
        });
    }
}
