import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private titleService: Title,
    private fb: FormBuilder
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
      userId: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      phone: ['', Validators.required],
      bDate: ['', Validators.required],
      gender: ['', Validators.required]
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
      console.log(this.loginForm.value);
      // Handle form submission logic
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
