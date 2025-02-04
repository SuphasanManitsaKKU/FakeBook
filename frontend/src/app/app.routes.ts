import { HomeComponent } from './page/home/home.component';
import { Routes } from '@angular/router';
import { LoginComponent } from './page/login/login.component';
import { RegisterComponent } from './page/register/register.component';
import { authGuard } from './auth.guard';
import { UserDetailComponent } from './page/user-detail/user-detail.component';
import { ChatComponent } from './page/chat/chat.component';
import { PostPageComponent } from './page/post-page/post-page.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },

    { path: '', component: HomeComponent, canActivate: [authGuard] },
    { path: 'user/:id', component: UserDetailComponent, canActivate: [authGuard] },
    { path: 'chat', component: ChatComponent, canActivate: [authGuard] },
    { path: 'post/:id', component: PostPageComponent, canActivate: [authGuard] },
];
