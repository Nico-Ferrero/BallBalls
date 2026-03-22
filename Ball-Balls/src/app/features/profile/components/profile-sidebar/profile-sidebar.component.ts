import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-profile-sidebar',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './profile-sidebar.component.html',
    styleUrls: ['./profile-sidebar.component.css']
})
export class ProfileSidebarComponent {
    activeTab = input<'public' | 'settings' | 'reservas'>('public');
    isCurrentUser = input<boolean>(false);
    tabChange = output<'public' | 'settings' | 'reservas'>();

    onTabChange(tab: 'public' | 'settings' | 'reservas') {
        this.tabChange.emit(tab);
    }
}
