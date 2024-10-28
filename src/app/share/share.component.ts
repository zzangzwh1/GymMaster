import { Component, OnInit } from '@angular/core';
import "primeicons/primeicons.css";
import { GetImage } from '../Service/images.service';
import { AuthService } from '../Service/auth.service';
import { Observable } from 'rxjs';
import { ShareBoardImages } from '../interfaces/interface';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ImageLike } from '../interfaces/interface';



@Component({
  selector: 'app-get-images',
  templateUrl: './share.component.html',
  styleUrl: './share.component.css'
})
export class ShareComponent implements OnInit {

  public currentMemberId : string = '';
  public memberImages : ShareBoardImages[] = [];
  public imageUrls: string[] = []; 
  public test: number =0;  
  public addLike : ImageLike ={
    ShareBoardId :0,
    MemberId : 0,
    ImageLike :0

  }
  public liked = false;
  constructor(private auth: AuthService,private image : GetImage,private titleService: Title,private router : Router) {
   

  }  


  ngOnInit(): void {  
    if(this.router.url.includes('Home'))
    {
      const memberId: string = sessionStorage.getItem('userId') || '';
      console.log('Current HOme');
      this.loadCurrentMemberImages(memberId);
    }
    else{
      this.titleService.setTitle('Share');
      this.loadMemberImages();
    }  
   
  }

  private loadMemberImages(): void {
    this.image.getImages().subscribe(
      (images: ShareBoardImages[] | undefined) => {
        if (!images || images.length === 0) {
          console.log('No images found for this member.');
          this.memberImages = [];
        } else {         
          this.memberImages = images;
          console.log('TEST---TEST',this.memberImages);
        }
      },
      (error) => this.handleError('Error fetching images', error) 
    );
  }
  private loadCurrentMemberImages(memberId: string): void {
    this.auth.getMemberIdByUserID(memberId).subscribe(
      (fetchedMemberId: string) => {
        this.currentMemberId = fetchedMemberId;
        console.log('Current Member ID:', fetchedMemberId);
  
        this.image.getMemberImage(Number(fetchedMemberId)).subscribe(
          (images: ShareBoardImages[] | undefined) => {
            if (!images || images.length === 0) {        
              console.log('No images found for this member.');
              this.memberImages = [];            
            } else {
              console.log('TEST',images);
              this.memberImages = images;           
           
            }
          },
          (error) => this.handleError('Error fetching images', error)
        );
      },
      (error) => this.handleError('Error fetching member ID', error)
    );
  }
  

  private handleError(message: string, error: any): void {
    console.error(message, error);
  }
  public likeImage(image: ShareBoardImages,index:number): void {
    this.addLike.MemberId = image.memberId;
    this.addLike.ShareBoardId = image.shareBoardId;
    if (this.memberImages[index].likeImage) {
      this.memberImages[index].likeImage = false; 
      this.addLike.ImageLike = 0;
      this.image.uploadImageLike(this.addLike).subscribe({
        next: (response) => {         
            console.log('Image uploaded successfully!', response);
        },
        error: (error) => {          
            console.error('Image like upload failed:', error);
            alert('Image like upload failed');
        },
        complete: () => {
            console.log('Image like upload completed');
        }
    });      
    } else {
      this.addLike.ImageLike = 1;
      this.memberImages[index].likeImage = true;  
      this.image.uploadImageLike(this.addLike).subscribe({
        next: (response) => {
            console.log('Image uploaded successfully!', response);             
        },
        error: (error) => {
            console.error('Image like upload failed:', error);
            alert('Image like upload failed');
        },
        complete: () => {
            console.log('Image like upload completed');
        }
    });
    }   
  } 
  
}

