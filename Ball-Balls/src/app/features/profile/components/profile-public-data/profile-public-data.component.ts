import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileResponse } from '../../../../core/interfaces/Users/ProfileResponse.interface';

@Component({
    selector: 'app-profile-public-data',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './profile-public-data.component.html',
    styleUrls: ['./profile-public-data.component.css']
})
export class ProfilePublicDataComponent {
    profile = input<ProfileResponse | null | undefined>();
    isCurrentUser = input<boolean>(false);
}
