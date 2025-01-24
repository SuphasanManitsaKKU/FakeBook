import { Component } from '@angular/core';
import { LogoutComponent } from '../../Components/logout/logout.component';
import { SearchComponent } from '../../Components/search/search.component';
import { NotificationComponent } from '../../Components/notification/notification.component';

@Component({
  selector: 'app-test-login',
  imports: [LogoutComponent,SearchComponent,NotificationComponent],
  templateUrl: './test-login.component.html',
  styleUrl: './test-login.component.css'
})
export class TestLoginComponent {

}
