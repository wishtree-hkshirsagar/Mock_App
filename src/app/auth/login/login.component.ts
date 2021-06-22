import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UIService } from 'src/app/shared/ui.service';
import { AuthService } from '../auth.service';
import { Subscription} from 'rxjs';
import 'rxjs/add/operator/map';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm: FormGroup;
  isLoading = false;
  private loadingSubs: Subscription;

  constructor(private authService: AuthService, private uiService: UIService) {}

  ngOnInit() {
    this.loadingSubs = this.uiService.loadingStateChanged.subscribe(isLoading => {
      this.isLoading = isLoading;
    });
    this.loginForm = new FormGroup({
      email: new FormControl('', {
        validators: [Validators.required, Validators.email]
      }),
      password: new FormControl('', { validators: [Validators.required] })
    });
  }

  emailValidation(): string {
    const email =  this.loginForm.get('email');
    if (email.touched && !email.valid) {
      if (email.errors.required) {
        return 'email is required !';
      }

      if (email.errors.email) {
        return 'invalid email !';
      }

    }
  }

  passwordValidation(): string {
    const password = this.loginForm.get('password');

    if (password.touched && !password.valid) {
      if (password.errors.required) {
        return 'password is required !';
      }

      if (password.errors.minLength) {
        return 'must be atleast 6 characters long !';
      }
    }
  }

  onSubmit() {
    this.authService.login({
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    });
  }

  ngOnDestroy() {
    if (this.loadingSubs) {
      this.loadingSubs.unsubscribe();
    }
  }
}
