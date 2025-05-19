import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import {Login} from '../interfaces/interface';
import { AuthService } from '../Service/auth.service';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthState } from '../store/auth/auth.reducer';
import { checkUserExists } from '../store/auth/auth.actions';
import { filter, take } from 'rxjs';
import { selectUserExists } from '../store/auth/auth.selector';
import { AuthFacade } from '../facade/auth.facade';

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
    private titleService: Title, private authService : AuthService, private router: Router, private facade:AuthFacade
  ) { 
    titleService.setTitle('Login');    
  }

  authentication() {
    if (this.loginInfo.userId !== '' && this.loginInfo.password !== '') {
      this.isLoading = true;

      this.authService.login(this.loginInfo).subscribe({
        next: (response) => {      
          if(response.success && response.message){
            localStorage.setItem('userId', this.loginInfo.userId);
            localStorage.setItem('jwtToken',response.message);    
            this.router.navigate(['/Home']);        
          }     
        
          this.isLoading = false;
          
        },
        error: (error) => {            
          this.isLoading = false;
          alert('Login Failed');
        }
      })

      }

  }
}