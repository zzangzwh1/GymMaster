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
      const userId = sessionStorage.getItem('userId') ?? null; // Get userId from sessionStorage
      console.log('USERID:', userId);
  
      if (userId !== null) {
        // Fetch member details using the userId
        this.auth.getMemberByUserName(userId).subscribe({
          next: (response: MemberDTO) => {
            console.log('Response Result:', response);
            this.storedMember = response; // Store the response in storedMember
            console.log(this.storedMember);
  
            // Create the form and populate it with the response
            this.editUser = this.createForm(response); // Pass response to populate the form
            this.editUser.get('userId')?.disable(); // Disable userId field
          },
          error: (err) => {
            console.error('Error occurred:', err);
            // Handle errors here (e.g., show a notification)
          }
        });
      }
    }
  
    // Create the form and populate it with data if available
    createForm(memberData: MemberDTO): FormGroup {
      console.log('Stored Member Data:', memberData);
  
      return this.fb.group({
        firstName: [memberData.firstName || '', [Validators.required, Validators.pattern(/^[A-Za-z]+$/)]],
        lastName: [memberData.lastName || '', [Validators.required, Validators.pattern(/^[A-Za-z]+$/)]],
        email: [memberData.email || '', [Validators.required, Validators.email]],
        address: [memberData.address || '', Validators.required],
        userId: [{ value: memberData.userId || '', disabled: true }, [Validators.required, Validators.pattern(/^[a-zA-Z0-9_-]{5,15}$/)]],
        password: [memberData.password || '', [Validators.required]],
        confirmPassword: [memberData.password || '', [Validators.required]],
        phone: [memberData.phone || '', [Validators.required, Validators.pattern(/^\d{10}$/)]],
        birthDate: [memberData.birthDate || '', Validators.required],
        sex: [memberData.sex || '', Validators.required]
      });
    }
  
    // Method to check if the field is invalid (touched and not valid)
    isFieldInvalid(field: string): boolean {
      const control = this.editUser.get(field);
      return control ? control.invalid && control.touched : false;
    }
  
    // Handle form submission
    onSubmit(): void {
      if (this.editUser.valid) {
        console.log('Form is valid!', this.editUser.value);
        // Proceed with the submission logic, for example:
        // this.authService.updateMember(this.editUser.value).subscribe(...)
      } else {
        console.log('Form is invalid');
        this.editUser.markAllAsTouched(); // Mark all fields as touched to show validation errors
      }
    }
}
