import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { UploadEvent } from 'primeng/fileupload';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent implements OnInit {
  public username :string = '';
  constructor(
    private titleService: Title,private messageService: MessageService
  ) { 
    titleService.setTitle('Home');
  }
  ngOnInit(): void {
    const currentUser = sessionStorage.getItem('userId');

      console.log('Test');
    
  }
  public onUpload(event: UploadEvent) {
    this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded Successfully' });
    console.log('EVENT  : ',event);
}
 


}
