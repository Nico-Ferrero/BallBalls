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
    activeTab = input<'public' | 'settings'>('public');
    isCurrentUser = input<boolean>(false);
    tabChange = output<'public' | 'settings'>();

    onTabChange(tab: 'public' | 'settings') {
        this.tabChange.emit(tab);
    }
}
