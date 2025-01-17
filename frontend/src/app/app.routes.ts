import { TestLoginComponent } from './test-login/test-login.component';
import { HomeComponent } from './home/home.component';
import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'test', component: TestLoginComponent, canActivate: [authGuard] }
];
