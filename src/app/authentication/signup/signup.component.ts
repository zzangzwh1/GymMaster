import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { AuthService } from '../../Service/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private titleService: Title,
    private fb: FormBuilder,
    private authService: AuthService, 
    private router: Router
  ) {
    this.titleService.setTitle('Sign Up');
  }

  ngOnInit(): void {
    this.loginForm = this.createForm();
  }

  createForm(): FormGroup {
    return this.fb.group({
      firstName: ['', [Validators.required, Validators.pattern(/^[A-Za-z]+$/)]],
      lastName: ['', [Validators.required, Validators.pattern(/^[A-Za-z]+$/)]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      userId: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9_-]{5,15}$/)]],
      password: ['', [Validators.required]],
      confirmPassword: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      birthDate: ['', Validators.required],
      sex: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ mismatch: true });
    } else {
      form.get('confirmPassword')?.setErrors(null);
    }
  }

  get confirmPasswordError(): string | null {
    const control = this.loginForm.get('confirmPassword');
    if (control?.hasError('required')) {
      return 'Confirm Password is required';
    } else if (control?.hasError('mismatch')) {
      return 'Passwords do not match';
    }
    return null;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.checkUserExists(this.loginForm.value.userId).subscribe({
        next: () => {         
          console.log('UserID Already Exists');
        },
        error: (err) => {
          if (err.status === 404) {
           
            this.authService.register(this.loginForm.value).subscribe({
              next: (response) => {
                console.log('Registered successfully:', response);
                alert(this.loginForm.value.userId +'is successfully created!');
                this.router.navigate(['/Authentication']);
               
              },
              error: (error) => {
                console.error('Registration failed:', error);
               
              }
            });
          } else {           
            console.error('An error occurred:', err);
          }
        }
      });
    } else {
      console.log('Form is invalid');
      this.loginForm.markAllAsTouched(); 
    }
  }

  // Method to check form control validation status
  isFieldInvalid(field: string): boolean | null{
    const control = this.loginForm.get(field);
    return control && !control.valid && control.touched;
  }
}
