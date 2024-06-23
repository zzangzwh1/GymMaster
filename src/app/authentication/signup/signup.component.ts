import { Component, OnInit } from '@angular/core';
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
    private authService : AuthService
    
  ) { 
    this.titleService.setTitle('Sign Up'); 
  }

  ngOnInit(): void {
    this.loginForm = this.createForm();
  }

  createForm(): FormGroup {
    return this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      userId: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      phone: ['', Validators.required],
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
          // User exists, handle the response as needed
          console.log('UserID Already Exists');
        
        },
        error: (err) => {
          if (err.status === 404) {
            // User does not exist, proceed with registration
            this.authService.register(this.loginForm.value).subscribe({
              next: (response) => {
                console.log('Registered successfully:', response);
                
              },
              error: (error) => {
                console.error('Registration failed:', error);
              
              }
            });
          } else {
            // Handle other errors
            console.error('An error occurred:', err);
          }
        }
      });
    } else {
      console.log('Form is invalid');
    }
  }
  
  
  
  // Method to check form control validation status
  isFieldInvalid(field: string): boolean | undefined{
    return (
      !this.loginForm.get(field)?.valid && 
      this.loginForm.get(field)?.touched
    );
  }
}
