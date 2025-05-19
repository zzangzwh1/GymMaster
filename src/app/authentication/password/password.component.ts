import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MemberDTO, forgotPassword } from '../../interfaces/interface';
import { Router } from '@angular/router';
import { AuthFacade } from '../../facade/auth.facade';
import { AuthService } from '../../Service/auth.service';
@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrl: './password.component.css',
})
export class PasswordComponent {
  userId: string = '';
  email: string = '';
  phone: string = '';
  selectedValue: string = '';
  public isUserExist: boolean | null = false;

  public getPassword: forgotPassword = {
    userId: '',
    phone: '',
    email: '',
    selectedValue: '',
  };
  public selcetedOption: string = '';

  constructor(private titleService: Title,private router :Router,private facade: AuthFacade, private auth : AuthService) {
    this.titleService.setTitle('Forgot Password');
  }
  errorText: string = '';
  optionErroText: string = '';
  ngOnInit(): void {}
  onUserIdChange(value: string): boolean {
    if (value == '') {     
      this.errorText = 'User ID is Required';
      return false;
    }
    this.errorText = '';
    console.log('User ID changed:', value);

    return true;
  }

  public searchUser() {
    if (this.onUserIdChange(this.userId)) {
      this.facade.getMemberByUserId(this.userId);

      this.facade.getMemberExistenceStatus().subscribe({
        next: (response) => {
          this.isUserExist = true;
          if(response !== null && response.memberId >0){
            this.email = this.secureNumberAndEmail(response.email);
            this.phone = this.secureNumberAndEmail(response.phone);
          }
          else{
            this.errorText = 'User is not Exists Please Try Again!';
          }

        },
        error: () => {        
          this.errorText = 'User is not Exists Please Try Again!';
        },
      });
    }
  }
  public secureNumberAndEmail(data: string): string {
    let result = '';  
    if (data.includes('@')) {
      this.getPassword.email = data;
      const [beforeAt, afterAt] = data.split('@');
      let firstPart = this.filterString(beforeAt);
      result = firstPart + '@' + afterAt;
    } else {
      this.getPassword.phone = data;
      result = this.filterString(data);
    }
    return result;
  }
  public filterString(data: string): string {
    let result = '';
    for (let i = 0; i < data.length; i++) {
      if (i === 0 || i === data.length - 1) {
        result += data[i];
      } else {
        result += '*';
      }
    }
    return result;
  }
  public requestPassword() {
    console.log(this.selectedValue);
    if (this.selectedValue !== '') {
      this.optionErroText = '';
      this.getPassword.selectedValue = this.selectedValue;
      this.getPassword.userId = this.userId;
      this.auth.requestPassword(this.getPassword).subscribe({
        next: (response) => {     
          alert("Your password has been sent to your email. Please check your inbox.");
          this.router.navigate(['/Authentication']);
        },
        error: (err) => {        
            alert("An unexpected error occurred.");          
        }
      });
    } else {
      this.optionErroText = 'Please Select your Option';
    }

   
  }
}
