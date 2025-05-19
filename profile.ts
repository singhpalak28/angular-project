import { Component } from '@angular/core'; 

import { FormBuilder, FormGroup, Validators } from '@angular/forms'; 

import { Router } from '@angular/router'; 

import { SignupService } from '../service/signup.service'; 

 

@Component({ 

  selector: 'app-signup', 

  templateUrl: './signup.component.html', 

  styleUrls: ['./signup.component.css'], 

}) 

export class SignupComponent { 

  signupForm: FormGroup; 

  captcha: string = this.generateCaptcha(); 

  showErrorPopup: boolean = false; 

  errorMessage: string = ''; 

 

  constructor(private fb: FormBuilder, private router: Router, private signupService: SignupService) { 

    this.signupForm = this.fb.group({ 

      name: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z\s]*$/)]], 

      phone: ['', [Validators.required, Validators.pattern(/^[7-9][0-9]{9}$/)]], 

      email: ['', [Validators.required, Validators.email, Validators.pattern(/^[a-zA-Z0-9._%+-]+@gmail\.com$/)]], 

      password: [ 

        '', 

        [ 

          Validators.required, 

          Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,12}$/), 

        ], 

      ], 

      confirmPassword: ['', Validators.required], 

      captchaInput: ['', Validators.required], 

      favorites: ['', Validators.required] // <-- 'favorites' 

    }); 

  } 

 

  allowOnlyDigits(event: KeyboardEvent): void { 

  const charCode = event.charCode; 

  if (charCode < 48 || charCode > 57) { 

    event.preventDefault(); 

  } 

} 

 

 

  get password() { return this.signupForm.get('password')?.value || ''; } 

  get hasMinLength() { return this.password.length >= 8 && this.password.length <= 12; } 

  get hasUppercase() { return /[A-Z]/.test(this.password); } 

  get hasAlphanumeric() { return /[a-zA-Z]/.test(this.password) && /\d/.test(this.password); } 

  get hasSpecialChar() { return /[!@#$%^&*]/.test(this.password); } 

  get confirmPassword() { return this.signupForm.get('confirmPassword')?.value || ''; } 

  get captchaInput() { return this.signupForm.get('captchaInput')?.value || ''; } 

  get hasPasswordMismatch() { 

    return this.signupForm.get('confirmPassword')?.touched && this.confirmPassword !== this.password; 

  } 

  get hasCaptchaMismatch() { 

    return this.signupForm.get('captchaInput')?.touched && this.captchaInput !== this.captcha; 

  } 

 

 

  generateCaptcha(): string { 

    return Math.random().toString(36).substring(2, 8); 

  } 

 

  refreshCaptcha(): void { 

    this.captcha = this.generateCaptcha(); 

  } 

 

  onSubmit() { 

    if (this.signupForm.invalid || this.hasPasswordMismatch || this.hasCaptchaMismatch) { 

      return; 

    } 

    const formValue = this.signupForm.value; 

    const userData: any = { 

      name: formValue.name, 

      phone: formValue.phone, 

      email: formValue.email, 

      password: formValue.password, 

    }; 

    if (formValue.favorites) userData.favorites = formValue.favorites; // Only if backend uses this 

    this.signupService.signup(userData).subscribe({ 

      next: () => { 

        alert('Signup successful!'); 

        this.router.navigate(['/login']); 

      }, 

      error: (error) => { 

        if (error.status === 400 && error.error.message?.includes('already exists')) { 

          this.errorMessage = 'Email or Phone number is already registered!'; 

          this.showErrorPopup = true; 

        } else { 

          alert('An unexpected error occurred. Please try again.'); 

        } 

      }, 

    }); 

  } 

 

  closePopup(): void { 

    this.showErrorPopup = false; 

  } 

} 
