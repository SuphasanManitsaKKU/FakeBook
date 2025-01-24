import { HomeComponent } from './page/home/home.component';
import { Routes } from '@angular/router';
import { LoginComponent } from './page/login/login.component';
import { RegisterComponent } from './page/register/register.component';
import { authGuard } from './auth.guard';
import { TestLoginComponent } from './page/test-login/test-login.component';
import { UserDetailComponent } from './page/user-detail/user-detail.component';
import { ChatComponent } from './page/chat/chat.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'test', component: TestLoginComponent, canActivate: [authGuard] },
    {
        path: 'user/:id',
        component: UserDetailComponent, // Component ที่แสดงรายละเอียดของ User
    },
    { path: 'chat', component: ChatComponent, canActivate: [authGuard] },
];
