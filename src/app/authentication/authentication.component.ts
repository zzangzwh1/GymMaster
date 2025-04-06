import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import {Login} from '../interfaces/interface';
import { AuthService } from '../Service/auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrl: './authentication.component.css'
})
export class AuthenticationComponent {
  loginInfo : Login ={
    userId : '',
    password : ''
  } ;

  name:string = '';  

  isRegister :boolean  =false;
  isLoading :boolean =false;
  constructor(
    private titleService: Title, private authService : AuthService, private router: Router
  ) { 
    titleService.setTitle('Login');
    
  }

  authentication() {
    if (this.loginInfo.userId !== '' && this.loginInfo.password !== '') {
     
      this.authService.checkUserExists(this.loginInfo.userId).subscribe(
        isExists => {
          console.log('User exists:', isExists);
          if (isExists ) {
            console.log(this.loginInfo);
            this.isLoading =true;
            this.authService.login(this.loginInfo).subscribe({
              next: (response) => {
                // Storing data
                sessionStorage.setItem('userId', this.loginInfo.userId);
                sessionStorage.setItem('password', this.loginInfo.password);                
                console.log('Logged in successfully:', response);
                this.isLoading =false;
                this.router.navigate(['/Home']);
                // Handle successful login
              },
              error: (error) => {
                console.error('Login failed:', error);
                this.isLoading =false;
                alert('Login Failed');
              }
            });
          }      
        
        },
        error => { 
          this.isLoading =false;
            alert('User not exists please try again!');
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