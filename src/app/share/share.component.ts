import { Component, OnInit } from '@angular/core';
import "primeicons/primeicons.css";
import { GetImage } from '../Service/images.service';
import { AuthService } from '../Service/auth.service';
import { ShareBoardImages } from '../interfaces/interface';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ImageLike } from '../interfaces/interface';
import { boardComment,MemberAndCommentInfoDTO } from '../interfaces/interface';
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
    userId : ''
  } 
  public getComments :boardComment[] =[];
  public comment : boardComment ={
    shareBoardId :0,
    memberId :0,
    comment:''
  }
public getCommentInfos : MemberAndCommentInfoDTO[] = [];
public commentInfo : MemberAndCommentInfoDTO ={
  userId: '',
  firstName: '',
  lastName:  '',  
  address:  '', 
  email: '',
  phone: '',
  shareBoardId: 0,
  memberId:0, 
  comment:'' 
}
buttonTextMap: { [key: number]: string } = {};
public tempComment: { name: string|null; comment: string ,shareBoardId :number }[] = []; 


  public isCommented: boolean[] = [];
  public isVisible : boolean[] = [];
  public memberId :string ='';
  public isHome: boolean =false;

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
      console.log('Current Home');
      this.isHome = true;
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
           console.log(this.memberId);  
           this.likedImages(memberId);
      
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
              this.likedImages(this.memberId) ;       
           
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
  private likedImages(memberId: string): void {
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
   
 if(image.shareBoardId && this.memberId){
  this.addLike.shareBoardId = image.shareBoardId;
  this.addLike.userId = this.memberId;

  this.image.uploadImageLike(this.addLike).subscribe({
    next: (response) => {
     
      console.log('Image liked successfully!', response);
  
     if (response.isSuccess && response.message ==='success') {      
       const result=  this.memberImages
          .filter(i => i.shareBoardId === image.shareBoardId)  
          .forEach(i => i.likeImage = true); 
               
      } else {          
        this.memberImages
          .filter(i => i.shareBoardId === image.shareBoardId)  
          .forEach(i => i.likeImage = false); 
                    
      }
        
    },
    error: (error) => {
      console.error('Image like upload failed:', error);
     
    }
  });
} else {
  alert("Please log in to like an image!");
}


    
}
  public toggleComments(image: ShareBoardImages, index: number): void { 
    this.isCommented[index] = !this.isCommented[index];
    console.log(image);
   
  }
  public addComment(comment: string, image: ShareBoardImages): void {

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
        const currentUser = sessionStorage.getItem('userId');
        this.tempComment.push({name:currentUser,comment:comment, shareBoardId:image.shareBoardId});
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
      this.comments.getCommentsAndMemberInfo().subscribe({
        next: (comments: MemberAndCommentInfoDTO[]) => {         
            this.getCommentInfos = comments;
            console.log(`comments TEST: ${comments} `);
        },
        error: (error) => {
          console.error('Error fetching comments:', error);
        }
      });
    
  }
  public onHover(isHovering: boolean, imageId: number): void {
    console.log('Image ID:', imageId);   
    this.buttonTextMap[imageId] = isHovering ? 'Delete' : 'X';
  }
  public deleteImage(image: ShareBoardImages): void {
    console.log('Delete Image', image);
  
    // Call the deleteImage service method and subscribe to it
    this.image.deleteImage(image.shareBoardId).subscribe({
      next: (deletedShareBoard: ShareBoardImages) => {
        console.log('Deleted Image Response: ', deletedShareBoard);     
      },
      error: (error) => {
        console.error('Error deleting image:', error);
      },
        complete: () => {
        console.log('Delete operation completed.');
        location.reload();
      }
    });
  }

  
  
}

