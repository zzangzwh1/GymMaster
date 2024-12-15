import { Component, OnInit } from '@angular/core';
import "primeicons/primeicons.css";
import { GetImage } from '../Service/images.service';
import { AuthService } from '../Service/auth.service';
import { Observable } from 'rxjs';
import { ShareBoardImages } from '../interfaces/interface';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ImageLike } from '../interfaces/interface';
import { boardComment } from '../interfaces/interface';
import {GetComment} from '../Service/comment.service';



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
    shareBoardId :0,
    memberId : 0,
    imageLike :0

  } 
  public getComments :boardComment[] =[];
  public comment : boardComment ={
    shareBoardId :0,
    memberId :0,
    comment:''
  }

  public isCommented: boolean[] = [];
  public isVisible : boolean[] = [];
  public memberId :string ='';

  public likedImageArr : ImageLike[] = [];
  public liked = false;
  constructor(private auth: AuthService,private image : GetImage,private comments : GetComment, private titleService: Title,private router : Router) {
    this.isCommented = new Array(this.memberImages.length).fill(false);
    
  }  


  ngOnInit(): void {  
     this.memberId = sessionStorage.getItem('userId') || '';  
    this.getEveryComment();
    if(this.router.url.includes('Home'))
    {
      console.log('Current HOme');
      this.loadCurrentMemberImages(this.memberId);
    }
    else{
      this.titleService.setTitle('Share');
      this.loadMemberImages(this.memberId);
    }  
    
   
  }

  private loadMemberImages(memberId: string): void {
    this.image.getImages().subscribe(
      (images: ShareBoardImages[] | undefined) => {
        if (!images || images.length === 0) {
          console.log('No images found for this member.');
          this.memberImages = [];
        } else {
          this.memberImages = images;            
          this.auth.getMemberIdByUserID(memberId).subscribe(
            (fetchedMemberId: string) => {
              this.currentMemberId = fetchedMemberId;    
              if (fetchedMemberId) {
                this.likedImages(Number(fetchedMemberId));
              }
            },
            (error) => this.handleError('Error fetching member ID', error)
          );
        }
      },
      (error) => this.handleError('Error fetching images', error)
    );
  }
  private loadCurrentMemberImages(memberId: string): void {
    this.auth.getMemberIdByUserID(memberId).subscribe(
      (fetchedMemberId: string) => {
        this.currentMemberId = fetchedMemberId;
               this.image.getMemberImage(Number(fetchedMemberId)).subscribe(
          (images: ShareBoardImages[] | undefined) => {
            if (!images || images.length === 0) {        
           
              this.memberImages = [];            
            } else {           
              this.memberImages = images;  
               
              this.likedImages(Number(fetchedMemberId)) ;       
           
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
  private likedImages(memberId: number): void {
    this.image.getlikedImages(memberId).subscribe({
        next: (likedImages) => {
      
          this.likedImageArr = likedImages;    
          this.memberImages.forEach((image) => {            
          const likedImage = likedImages.find((liked) => liked.shareBoardId === image.shareBoardId);        
            if (likedImage) {
             image.likeImage = true;           
            }
          });         
        },
        error: (error) => {
            console.error('Error fetching liked images:', error);
         
        }
    });
}

  public likeImage(image: ShareBoardImages,index:number): void {
   
    this.addLike.memberId = image.memberId;
    this.addLike.shareBoardId = image.shareBoardId;

    if (this.memberImages[index].likeImage) {
      this.memberImages[index].likeImage = false; 
      this.addLike.imageLike = 0;
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
      this.addLike.imageLike = 1;
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
  public toggleComments(image: ShareBoardImages, index: number): void { 
    this.isCommented[index] = !this.isCommented[index];
    console.log(image);
   
  }
  public addComment(comment: string, image: ShareBoardImages): void {
    // Validate input data
    console.log(image);
    if (!comment.trim() || image.memberId <= 0 || image.shareBoardId <= 0) {
      console.warn('Invalid input: Comment text or IDs are missing or invalid.');
      return;
    }
  
    // Create the boardComment object
    const boardComment: boardComment = {
      comment: comment, 
      memberId: image.memberId,
      shareBoardId: image.shareBoardId
    };
  
    // Make the API call to add the comment
    this.comments.addComment(boardComment).subscribe({
      next: (response) => {
        console.log('Comment added successfully:', response);
        let commentText = document.getElementById('commentText') as HTMLInputElement;      
        commentText.value = '';
      },
      error: (error) => {
        console.error('Failed to add comment:', error);
       
      },
      complete: () => {
        console.log('Add Comment operation completed.');
    
      }
    });
  }
  public getEveryComment(): void {   
      this.comments.getComments().subscribe({
        next: (comments: boardComment[]) => {         
            this.getComments = comments;
        },
        error: (error) => {
          console.error('Error fetching comments:', error);
        }
      });
    
  }

  
  
}

