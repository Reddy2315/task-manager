import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component/login.component';
import { RegisterComponent } from './pages/register/register.component/register.component';
import { BoardComponent } from './pages/board/board.component/board.component';
import { ProfileComponent } from './pages/profile/profile.component/profile.component';


export const routes: Routes = [
{ path: '', pathMatch: 'full', redirectTo: 'board' },
{ path: 'login', component: LoginComponent },
{ path: 'register', component: RegisterComponent },
{ path: 'board', component: BoardComponent },
{ path: 'profile', component: ProfileComponent },
{ path: 'board', component: BoardComponent }
];
