import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';
import { ProfileResponse } from '../../../../core/interfaces/Users/ProfileResponse.interface';

@Component({
    selector: 'app-profile-header',
    standalone: true,
    imports: [CommonModule, SkeletonModule],
    templateUrl: './profile-header.component.html',
    styleUrls: ['./profile-header.component.css']
})
export class ProfileHeaderComponent {
    profile = input<ProfileResponse | null | undefined>();
    isLoading = input<boolean>(false);
    isCurrentUser = input<boolean>(false);
}
