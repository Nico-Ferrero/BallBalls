import { Injectable, signal, effect } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    darkMode = signal<boolean>(false);

    constructor() {
        // Check local storage or system preference
        const savedTheme = localStorage.getItem('ballballs-theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (savedTheme) {
            this.darkMode.set(savedTheme === 'dark');
        } else {
            this.darkMode.set(prefersDark);
        }

        // Effect to apply theme changes
        effect(() => {
            if (this.darkMode()) {
                document.documentElement.classList.add('dark');
                localStorage.setItem('ballballs-theme', 'dark');
            } else {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('ballballs-theme', 'light');
            }
        });
    }

    toggleTheme() {
        this.darkMode.update(dark => !dark);
    }
}
