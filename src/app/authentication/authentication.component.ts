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
    private titleService: Title, private authService : AuthService, private router: Router,private store: Store<{ auth: AuthState }>
  ) { 
    titleService.setTitle('Login');
    
  }

  authentication() {
    if (this.loginInfo.userId !== '' && this.loginInfo.password !== '') {
      this.isLoading = true;

      this.store.dispatch(
        checkUserExists({ userId: this.loginInfo.userId })        
      );
  
    
      this.store
        .select(selectUserExists)
        .pipe(
          filter((exists) => exists !== null), 
          take(1)                            
        )
        .subscribe((exists) => {
          this.isLoading = false;
  
          if (exists) {       
            this.isLoading = true;
            this.authService.login(this.loginInfo).subscribe({
              next: (response) => {;            
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
          }
        });
  
    } else {
      console.log('Please fill in both User ID and Password.');
    }
  }
}