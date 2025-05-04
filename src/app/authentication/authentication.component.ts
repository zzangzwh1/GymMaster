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

      this.facade.checkIfUserExists(this.loginInfo.userId);    
      this.facade.getUserExistenceStatus().subscribe({
        next : (exist) =>{
          this.isLoading = false;  
          if (exist) {       
            this.isLoading = true;
            console.log(' if (exist)',this.loginInfo);
            this.authService.login(this.loginInfo).subscribe({
              next: (response) => {
                console.log('')          
                sessionStorage.setItem('userId', this.loginInfo.userId);
       
                this.isLoading = false;
                this.router.navigate(['/Home']);
              },
              error: (error) => {            
                this.isLoading = false;
                alert('Login Failed');
              }
            });
          } else {
            alert('Sorry, that User ID does not exist. Please try again!');
            this.loginInfo = { userId: '', password: '' };
            this.isLoading = false;
          }
        }
      })

      }

  }
}