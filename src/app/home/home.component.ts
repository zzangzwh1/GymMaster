import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { UploadEvent } from 'primeng/fileupload';
import { MessageService } from 'primeng/api';
import { HttpClient } from '@angular/common/http';
import { UploadImage } from '../interfaces/interface';
import { AuthService } from '../Service/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent implements OnInit {
  public username :string = '';
  private selectedFile: File | null = null;
  private currentMeberId:string  ='';
  public uploadImages :UploadImage ={
    memberId : 0,
    formData : null
 }
  

  
  private dotnetMemberUrl = 'https://localhost:7298/api/Image/upload';
  constructor(
    private titleService: Title,private messageService: MessageService,private http: HttpClient,private auth: AuthService
  ) { 
    titleService.setTitle('Home');
  }
  ngOnInit(): void {
    const currentUser = sessionStorage.getItem('userId');

      console.log('Test');
    
  }
  public onSelect(event: any) {
    const member: string =  sessionStorage.getItem('userId')|| ''; 
   
    this.auth.getMemberIdByUserID(member).subscribe(
      (memberId: string) => {
        this.currentMeberId = memberId;
       
      },
      (error) => {
        this.currentMeberId = '';
        console.error('Error fetching member ID:', error);
      }
    );
    this.selectedFile = event.files[0];  // Capture the selected file
    console.log(this.selectedFile);
  }
  public onUpload() {
    if (this.selectedFile && this.currentMeberId !== '') {
      const formData = new FormData();
      formData.append('image', this.selectedFile, this.selectedFile.name);
      formData.append('memberId', this.currentMeberId.toString());
  
      // Specify responseType: 'text' to handle plain text response
      this.http.post(this.dotnetMemberUrl, formData, { responseType: 'text' }).subscribe({
        next: (response : any) => {
          // Since response is plain text, it will be handled as a string
          this.messageService.add({ severity: 'info', summary: 'Success', detail: response });
  
          // Optional: Log the response
          console.log('Response:', response);
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'File Upload Failed' });
          console.error('Error:', err);
        }
      });
    }
  }
  
 


}
