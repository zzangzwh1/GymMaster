import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import {Login} from '../interfaces/interface';
import { AuthService } from '../Service/auth.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrl: './authentication.component.css'
})
export class AuthenticationComponent {
  constructor(
    private titleService: Title, private authService : AuthService
  ) { 
    titleService.setTitle('Login');
    
  }
  loginInfo : Login ={
    userId : '',
    password : ''
  } ;

  name:string = '';  

  isRegister :boolean  =false;
  authentication() {
    if (this.loginInfo.userId !== '' && this.loginInfo.password !== '') {
      this.authService.checkUserExists(this.loginInfo.userId).subscribe(
        isExists => {
          console.log('User exists:', isExists);
          if (isExists) {
            console.log(this.loginInfo);
            this.authService.login(this.loginInfo).subscribe({
              next: (response) => {
                console.log('Logged in successfully:', response);
                // Handle successful login
              },
              error: (error) => {
                console.error('Login failed:', error);
                // Handle login error
              }
            });
          } else {
            this.authService.register(this.loginInfo).subscribe(
              response => {
                console.log('Registered successfully:', response);
                // Handle successful registration
              },
              error => {
                console.error('Registration failed:', error);
                // Handle registration error
              }
            );
          }
        },
        error => {
          console.error('Error checking user existence:', error);
          // Handle error
        }
      );
    } else {
      console.log('Fail');
    }
    console.log(this.loginInfo);
  }
}