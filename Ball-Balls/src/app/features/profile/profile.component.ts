import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { SkeletonModule } from 'primeng/skeleton';

// NgRx
import { Store } from '@ngrx/store';
import { selectCurrentUser } from '../auth/store/selectors';
import { selectProfile, selectProfileLoading, selectProfileError } from './store/selectors';
import { loadProfile } from './store/actions';

// Subcomponents
import { ProfileHeaderComponent } from './components/profile-header/profile-header.component';
import { ProfileSidebarComponent } from './components/profile-sidebar/profile-sidebar.component';
import { ProfilePublicDataComponent } from './components/profile-public-data/profile-public-data.component';
import { ProfileSettingsComponent } from './components/profile-settings/profile-settings.component';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [
        CommonModule,
        SkeletonModule,
        ProfileHeaderComponent,
        ProfileSidebarComponent,
        ProfilePublicDataComponent,
        ProfileSettingsComponent
    ],
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
    private store = inject(Store);
    private route = inject(ActivatedRoute);
    private router = inject(Router);

    // Global State Signals
    currentUser = this.store.selectSignal(selectCurrentUser);
    profile = this.store.selectSignal(selectProfile);
    isLoading = this.store.selectSignal(selectProfileLoading);
    error = this.store.selectSignal(selectProfileError);

    // Route state
    private routeParams = toSignal(this.route.paramMap);
    private routeUrl = toSignal(this.route.url);

    // Local State Signals
    activeTab = signal<'public' | 'settings'>('public');

    // Computed
    isCurrentUser = computed(() => {
        const urlSegments = this.routeUrl();
        const mePath = urlSegments?.some(segment => segment.path === 'me');
        if (mePath) return true;

        const params = this.routeParams();
        const usernameParam = params?.get('username');
        const loggedInUser = this.currentUser();

        return loggedInUser !== null && loggedInUser?.username === usernameParam;
    });

    targetUsername = computed(() => {
        const urlSegments = this.routeUrl();
        const mePath = urlSegments?.some(segment => segment.path === 'me');
        if (mePath) {
            return this.currentUser()?.username;
        }
        return this.routeParams()?.get('username');
    });

    ngOnInit(): void {
        this.loadUserData();
    }

    private loadUserData() {
        const username = this.targetUsername();
        // Carga el perfil dinámicamente según la ruta
        if (username) {
            this.store.dispatch(loadProfile({ username }));
        }
    }

    setTab(tab: 'public' | 'settings') {
        this.activeTab.set(tab);
    }
}
