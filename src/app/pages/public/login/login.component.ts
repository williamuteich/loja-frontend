import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './login.component.html',
    styles: ``
})
export class LoginComponent {
    login() {
        alert('Login performed (simulated)!');
    }
}
