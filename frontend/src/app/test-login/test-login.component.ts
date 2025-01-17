import { Component } from '@angular/core';
import { LogoutComponent } from '../Components/logout/logout.component';

@Component({
  selector: 'app-test-login',
  imports: [LogoutComponent],
  templateUrl: './test-login.component.html',
  styleUrl: './test-login.component.css'
})
export class TestLoginComponent {

}
