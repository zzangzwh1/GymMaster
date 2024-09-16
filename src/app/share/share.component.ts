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
  public likes: ImageLike = {
    ShareBoardId :0,
    MemberId :0,
    Like :0

  };
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
          this.memberImages = []; // Set to an empty array if no images are found
        } else {
          console.log('TEST', images);
          this.memberImages = images;
          console.log('TEST---TEST',this.memberImages);
        }
      },
      (error) => this.handleError('Error fetching images', error) // Correctly placed error callback
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
              this.memberImages = []; // Set to an empty array if no images are found
           
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
    console.log(index);
    if (this.memberImages[index].likeImage) {
      this.memberImages[index].likeImage = false; // Toggle to false\
      console.log(this.memberImages[index].likeImage);
    } else {
      this.memberImages[index].likeImage = true;  // Toggle to true
      this.likes.Like =1;
      this.likes.MemberId = image.memberId;
      this.likes.ShareBoardId = image.shareBoardId;

    

      

    }
    //this.memberImages[index].likeImage = !this.memberImages[index].likeImage;
    
    console.log(image);
    console.log('Like Clicked!');
  }
  
}

