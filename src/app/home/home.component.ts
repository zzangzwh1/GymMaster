import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { UploadEvent } from 'primeng/fileupload';
import { MessageService } from 'primeng/api';
import { HttpClient } from '@angular/common/http';
import { UploadImage } from '../interfaces/interface';
import { AuthService } from '../Service/auth.service';
import { SignalrService } from '../Service/signalR.service';
import { AuthFacade } from '../facade/auth.facade';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent implements OnInit {
  public username :string ='';
  private selectedFile: File | null = null;
  private currentMeberId:number =0;
  public uploadImages :UploadImage ={
    memberId : 0,
    formData : null
 }
  public isLoggedIn :boolean =false;
  isLoading = true;
  
  private dotnetMemberUrl = 'https://localhost:7298/api/Image/upload';
  constructor(
    private titleService: Title,private messageService: MessageService,private http: HttpClient,private auth: AuthService ,private signalrService :SignalrService,
    private facade : AuthFacade
  ) { 
    titleService.setTitle('Home');
   
  }
  ngOnInit(): void {  
    this.isLoading = false;
    this.username = localStorage.getItem('userId') || '';  
    console.log('TEST~~~~~~~~~~UserName LOcal Stroage',this.username);
  }
  public onSelect(event: any) {

    if(this.username !== ''){
  
      this.facade.getMemberByUserId(this.username);
      this.facade.getMemberExistenceStatus().subscribe({
        next: (response)=>{        
          this.currentMeberId = response?.memberId ?? 0;
        },
        error : (error) =>{
          console.log('ERRRRRRRRROR ',error);
        }
      })
    }

    this.selectedFile = event.files[0]; 
    console.log(this.selectedFile);
  }
  public onUpload() {
    if (this.selectedFile && this.currentMeberId >0) {
      
      const formData = new FormData();
      formData.append('image', this.selectedFile, this.selectedFile.name);
      formData.append('memberId', this.currentMeberId.toString());
  
     
      this.http.post(this.dotnetMemberUrl, formData, { responseType: 'text' }).subscribe({
        next: (response : any) => {        
          this.messageService.add({ severity: 'info', summary: 'Success', detail: response });       
          window.location.reload();
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'File Upload Failed' });      
        }
      });
    }
    
  }
  
 


}
