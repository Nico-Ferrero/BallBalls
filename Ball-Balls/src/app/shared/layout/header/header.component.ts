import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ThemeService } from '../../../core/services/theme.service';
import { LucideAngularModule, Moon, Sun, Menu, X, ChevronDown, User, Settings, LogOut, Wallet, Calendar } from 'lucide-angular';
import { Store } from '@ngrx/store';
import { selectCurrentUser, selectIsAuthenticated } from '../../../features/auth/store/selectors';
import { logout } from '../../../features/auth/store/actions';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [CommonModule, RouterModule, LucideAngularModule],
    templateUrl: './header.component.html',
    styles: [
        `
        :host {
            display: block;
        }
        `
    ]
})
export class HeaderComponent {
    themeService = inject(ThemeService);
    private store = inject(Store);

    isMenuOpen = false;
    isUserMenuOpen = signal(false);

    readonly Moon = Moon;
    readonly Sun = Sun;
    readonly Menu = Menu;
    readonly X = X;
    readonly ChevronDown = ChevronDown;
    readonly UserIcon = User;
    readonly Settings = Settings;
    readonly LogOut = LogOut;
    readonly Wallet = Wallet;
    readonly Calendar = Calendar;

    // Connect to store signals
    user = this.store.selectSignal(selectCurrentUser);
    isAuthenticated = this.store.selectSignal(selectIsAuthenticated);

    toggleMenu() {
        this.isMenuOpen = !this.isMenuOpen;
        if (this.isMenuOpen) this.isUserMenuOpen.set(false);
    }

    toggleUserMenu() {
        this.isUserMenuOpen.update(v => !v);
        if (this.isUserMenuOpen()) this.isMenuOpen = false;
    }

    closeUserMenu() {
        this.isUserMenuOpen.set(false);
    }

    toggleTheme() {
        this.themeService.toggleTheme();
    }

    onLogout() {
        this.store.dispatch(logout());
        this.isUserMenuOpen.set(false);
        this.isMenuOpen = false;
    }
}
