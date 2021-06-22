import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, ValidatorFn, Validators } from '@angular/forms';
import { UIService } from 'src/app/shared/ui.service';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {

  maxDate;
  isLoading = false;
  signupForm: FormGroup;
  private loadingSubs: Subscription;

  constructor(private authService: AuthService, private uiService: UIService) { }

  ngOnInit(): void {
    this.signupForm = new FormGroup({
      email: new FormControl('', [Validators.email, Validators.required, Validators.minLength(6)]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', [Validators.required]),
      birthdate: new FormControl('', [Validators.required]),
      termsAndConditions: new FormControl('', [Validators.required])
    },
    {
      validators: this.MustMatch('password', 'confirmPassword')
    });
    this.loadingSubs = this.uiService.loadingStateChanged.subscribe(isLoading => {
      this.isLoading = isLoading;
    });
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
  }

  emailValidation(): string {
    const email =  this.signupForm.get('email');
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
    const password = this.signupForm.get('password');

    if (password.touched && !password.valid) {
      if (password.errors.required) {
        return 'password is required !';
      }

      if (password.errors.minLength) {
        return 'must be atleast 6 characters long !';
      }
    }
  }


  confirmPasswordValidation(): string {
    const confirmPassword = this.signupForm.get('confirmPassword');

    if (confirmPassword.touched && !confirmPassword.valid) {
      if (confirmPassword.errors.required) {
        return 'confirm password is required !';
      }

      if (confirmPassword.errors.MustMatch) {
        return 'confirm password did not match !';
      }
    }
  }

  dateValidation(): string {
    const date = this.signupForm.get('birthdate');
    if (date.touched && !date.valid) {
      if (date.errors.required) {
        return 'birth date is required !';
      }
    }
  }

  MustMatch(controlName: string, matchingControlName: string): ValidatorFn{
    return(formGroup: FormGroup): ValidatorFn => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.MustMatch){
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({MustMatch: true});
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  onSubmit(): void {
    console.log(this.signupForm);
    this.authService.registerUser({
      email: this.signupForm.value.email,
      password: this.signupForm.value.password
    });
  }

  ngOnDestroy(): void {
    if (this.loadingSubs) {
      this.loadingSubs.unsubscribe();
    }
  }

}
