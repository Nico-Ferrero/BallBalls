import { Routes } from "@angular/router";
import { ProfileComponent } from "./profile.component";
import { authGuard } from "../../core/guards/auth.guard";
import { meGuard } from "./guards/me.guard";

export const profileRoutes: Routes = [
    {
        path: 'me',
        canActivate: [authGuard],
        component: ProfileComponent,
        title: 'Mi Perfil - Ball&Balls'
    },
    {
        path: ':username',
        canActivate: [meGuard],
        component: ProfileComponent,
        title: 'Perfil de Usuario - Ball&Balls'
    }
];