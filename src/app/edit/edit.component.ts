import { Component } from '@angular/core';
import { FormGroup ,Validators,FormBuilder} from '@angular/forms';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { AuthService } from '../Service/auth.service';
import { MemberDTO } from '../interfaces/interface';



@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css'
})
export class EditComponent {
    editUser!: FormGroup;
    public storedMember: MemberDTO = {} as MemberDTO; 
    constructor(    private titleService: Title,
        private fb: FormBuilder,     
        private router: Router,
        private auth :AuthService,    
     ) {
          this.titleService.setTitle('Edit');
    }
    ngOnInit(): void {
      const userId = sessionStorage.getItem('userId') ?? null; 
      console.log('USERID:', userId);
  
      if (userId !== null) {
      
        this.auth.getMemberByUserName(userId).subscribe({
          next: (response: MemberDTO) => {
            console.log('Response Result:', response);
            this.storedMember = response; 
            console.log(this.storedMember);
  
            this.editUser = this.createForm(response); 
           // this.editUser.get('userId')?.disable(); 
          },
          error: (err) => {
            console.error('Error occurred:', err);
          
          }
        });
      }
    }
  
    // Create the form and populate it with data if available
   public createForm(memberData: MemberDTO): FormGroup {
      console.log('Stored Member Data:', memberData);
  
      let tempConfirmPassword = memberData.password;
   
      return this.fb.group({
        firstName: [memberData.firstName || '', [Validators.required, Validators.pattern(/^[A-Za-z]+$/)]],
        lastName: [memberData.lastName || '', [Validators.required, Validators.pattern(/^[A-Za-z]+$/)]],
        email: [memberData.email || '', [Validators.required, Validators.email]],
        address: [memberData.address || '', []], 
        userId:  [memberData.userId || '' , []],
        password: [memberData.password || '', [Validators.required]],
        confirmPassword: [tempConfirmPassword, Validators.required],
        phone: [memberData.phone || '', [Validators.required, Validators.pattern(/^\d{10}$/)]],
        birthDate: [memberData.birthDate || '', Validators.required],
        sex: [memberData.sex || '', Validators.required]
      },{ validators: this.passwordMatchValidator } );
    }

 public passwordMatchValidator(form: FormGroup) :void{
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ mismatch: true });
    } else {
      const confirmPasswordControl = form.get('confirmPassword');
      if (confirmPasswordControl?.hasError('mismatch')) {
        confirmPasswordControl.setErrors(null); 
      }
    }
  }

  public  isFieldInvalid(field: string): boolean {
      const control = this.editUser.get(field);
      return control ? control.invalid && control.touched : false;
    }  
 
   public onSubmit(): void {
      if (this.editUser.valid) {
        console.log('Form is valid!', this.editUser.value);

        this.auth.updateUserInfo( this.editUser.value).subscribe({
          next: (updatedMember) => {
            console.log('User info updated successfully:', updatedMember);
     
          },
          error: (err) => {
            console.error('Failed to update user info:', err);
       
          }
        });
        
      } else {
        console.log('Form is invalid');
        this.editUser.markAllAsTouched(); 
      }
    }
}
