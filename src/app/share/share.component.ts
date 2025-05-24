import { Component, OnInit } from '@angular/core';
import "primeicons/primeicons.css";
import { GetImage } from '../Service/images.service';
import {   ShareBoardImages } from '../interfaces/interface';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ImageLike } from '../interfaces/interface';
import { boardComment,MemberAndCommentInfoDTO } from '../interfaces/interface';
import {GetComment} from '../Service/comment.service';
import { SignalrService } from '../Service/signalR.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AuthFacade } from '../facade/auth.facade';

@Component({
  selector: 'app-get-images',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.css'] 
})
export class ShareComponent implements OnInit {
  private destroy$ = new Subject<void>();
  public currentMemberId : string = '';
  public memberImages : ShareBoardImages[] = [];
  public imageUrls: string[] = []; 
  public test: number =0;  
  public addLike : ImageLike ={
    shareBoardId :0,
    userId : '',
    totalCount :0
  } 
  public getComments :boardComment[] =[];
  public comment : boardComment ={
    boardCommentId :0,
    shareBoardId :0,
    memberId :'',
    comment:''
  }
  updateComment : boardComment = {
    boardCommentId :0,
    shareBoardId :0,
    memberId :'',
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
  comment:'',
  boardCommentId :0 
}
commentText = '';
page :number =4;
currentImageShardBoardId: number =0;
hasMore:boolean = true;
likeImages : ImageLike[] = [];
buttonTextMap: { [key: number]: string } = {};
public tempComment: { name: string|null; comment: string ,shareBoardId :number }[] = []; 
isLoading :boolean = false;

  public isCommented: boolean[] = [];
  public isVisible : boolean[] = [];
  public memberId :string ='';
  public isHome: boolean =false;
  public editCommentId: number | null = null;
  public likedImageArr : ImageLike[] = [];
  public liked = false;
  public canScroll = false;
  constructor(private image : GetImage,private comments : GetComment, private titleService: Title,private router : Router,private signalrService: SignalrService,private facade :AuthFacade) {
    this.isCommented = new Array(this.memberImages.length).fill(false);
    
  }  

  ngOnInit(): void {     
    this.signalR();    
    this.memberId = localStorage.getItem('userId') || '';     
 
    if(this.router.url.includes('Home'))
    { 
      this.isHome = true;     
      this.loadCurrentMemberImages(this.memberId);
 
    }
    else{   
      this.titleService.setTitle('Share');
      this.canScroll= true;
      this.memberImages.filter(i=> i.shareBoardId).length >0 ? this.currentImageShardBoardId = this.memberImages.filter(i=> i.shareBoardId).length -1 : 0;
      this.loadCurrentPageImages(this.currentImageShardBoardId ,this.page,true);

    }   

  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


  signalR():void {
    this.signalrService.startConnection();  
    this.signalrService.listenForLikeCountUpdate();
    this.signalrService.listenForCommentUpdate();
    this.signalrService.listenForImage();

    this.signalrService.image$.subscribe(images =>{
      this.memberImages = images;
    })
    this.signalrService.likeCount$.subscribe((likeCounts) => {
      this.likeImages = likeCounts;    
     
    }); 

    this.signalrService.comment$.subscribe(comment => {
    this.getCommentInfos = comment;
    });
  
  }


  startEdit(commentId: number): void {
    this.editCommentId = commentId;  
  }

  saveEdit(commentId: number, text :string): void {
   this.updateComment.boardCommentId = commentId;
   this.updateComment.comment = text;
   this.comments.editComment(this.updateComment).subscribe({
    next :() =>{   
      this.getImageComments(this.memberImages);
    },error :()=>{
      console.log('Fail!');
    }
  
   })

    this.editCommentId = null; 
  }

  cancelEdit(): void {
    this.editCommentId = null; 
  }

  deleteComment(commentId: number): void {   
    this.comments.deleteComment(commentId).subscribe({
      next :(response) =>{   
        console.log('DELETE COMMMENT~~',response);
        this.getImageComments(this.memberImages);
      },error :()=>{
        console.log('Fail!');
      }
    
  })
  }
  toLowerCase(text:string):string{
    return text.toLocaleLowerCase();
  }  

  public getLikeCount(shareBoardId: number): number {
    let likeData = this.likeImages.filter(g => g.shareBoardId === shareBoardId);
    return likeData.length > 0 ? likeData[0].totalCount : 0;
  }

  private loadCurrentMemberImages(userId: string): void {
    this.isLoading= true;
    this.facade.getMemberByUserId(userId);    
    this.facade.getMemberExistenceStatus().subscribe(
      (memberRespone) => {   
       
        if(memberRespone !==null && memberRespone.memberId >0 ){
          this.currentMemberId = memberRespone.userId;
          this.image.getMemberImage(memberRespone.memberId).subscribe(
            (images: ShareBoardImages[] | undefined) => {
              if (!images || images.length === 0) {       
             
                this.memberImages = [];            
              } else {          
                
                this.memberImages = [...images]
                this.getCurrentLikedImages(images);
                this.getImageComments(images);                
                console.log('loadCurrentMemberImages');
             
              }
              this.isLoading= false;
            },
            (error) => this.handleError('Error fetching images', error)
          );
        }       
         
      },
      (error) => this.handleError('Error fetching member ID', error)
    );
    this.isLoading= false;
  }
  

  private handleError(message: string, error: any): void {
    console.error(message, error);
  }
  private getCurrentLikedImages(images: ShareBoardImages[])
  {
    this.image.getLikedImages(images).subscribe({
     
      next :(response) =>{
        console.log('TES~~t',response);      
        this.likeImages = response;    
   
      },
      error :(error) =>{
        console.log(error);
      }

    })

  }
 
 public likeImage(image: ShareBoardImages): void {
   
 if(image.shareBoardId && this.memberId){
  this.addLike.shareBoardId = image.shareBoardId;
  this.addLike.userId = this.memberId;

  this.image.uploadImageLike(this.addLike).subscribe({
    next: (response) => {

     if (response.isSuccess && response.message ==='success') {      
        this.memberImages
          .filter(i => i.shareBoardId === image.shareBoardId)  
          .forEach(i => i.likeImage = true); 
               
      } else {          
        this.memberImages
          .filter(i => i.shareBoardId === image.shareBoardId)  
          .forEach(i => i.likeImage = false); 
                    
      }    
    this.getCurrentLikedImages( this.memberImages);
        
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
   
  }
  onScroll(): void {
    if(!this.canScroll){
      return;
    }
    const scrollElem = document.querySelector('.row');
   
  if(scrollElem != null ){    
 
    const atBottom = scrollElem.scrollTop + scrollElem.clientHeight >= scrollElem.scrollHeight - 1;
    const atTop = scrollElem.scrollTop === 0;   
    let filteredShareBoard = this.memberImages.filter(i => i.shareBoardId)[this.page-1].shareBoardId; 
    if (atBottom) { 
      scrollElem.scrollTop = 1;  
      this.loadCurrentPageImages(filteredShareBoard,this.page,true);  
    
    }
    if(atTop){   
      this.loadCurrentPageImages(filteredShareBoard,this.page,false);
    }
  }

  } 
  loadCurrentPageImages(shardBoardId: number, page: number,  isScrollDown: boolean): Promise<void> {
    if (this.isLoading) {     
      return Promise.resolve();
    }    
    this.isLoading = true;  
    return new Promise((resolve, reject) => {
      const handleSuccess = (images: ShareBoardImages[]) => {        
        if (images.length > 0) {
          this.memberImages = [...images];       
          this.getCurrentLikedImages(images);
          this.getImageComments(images);
         
          resolve();
        } else {
          console.error('No images found', images);
          reject();
        }
        this.isLoading = false;
      
      };  
      const handleError = (err: any) => {       
        this.isLoading = false;        
        reject();
      };  
      const observable = isScrollDown
        ? this.image.getScrollDownImages(shardBoardId, page)
        : this.image.getScrollUpImages(shardBoardId, page);
  
      observable.pipe(takeUntil(this.destroy$)).subscribe({
        next: handleSuccess,
        error: handleError
      });
    });
  }  
  public addComment(comment: string, image: ShareBoardImages,inputElement: HTMLInputElement): void {
    if (!comment.trim() || image.memberId <= 0 || image.shareBoardId <= 0) {
      console.warn('Invalid input: Comment text or IDs are missing or invalid.');
      return;
    }
    const boardComment: boardComment = {
      boardCommentId :0,
      comment: comment, 
      memberId: this.memberId,
      shareBoardId: image.shareBoardId
    };
  
    
    this.comments.addComment(boardComment).subscribe({
      next: (response) => {        
        let commentText = document.getElementById('commentText') as HTMLInputElement;      
        commentText.value = '';       
        this.commentText = '';  
        inputElement.value ='';
        this.getImageComments(this.memberImages);
      },
      error: (error) => {
        console.error('Failed to add comment:', error);
       
      }
    });
 
  }
  public getImageComments(images:ShareBoardImages[]): void {    
      this.comments.getComments(images).subscribe({
        next: (comments: any) => {         
            this.getCommentInfos = comments;
            console.log('getImageComments TEST~!!!~~: ',comments);
          
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
  
    this.image.deleteImage(image.shareBoardId).subscribe({
      next: (deletedShareBoard: ShareBoardImages) => {         
        const index = this.memberImages.findIndex(i => i.shareBoardId === image.shareBoardId);
        if (index !== -1) {
          this.memberImages.splice(index, 1);
        }
        
      },
      error: (error) => {
        console.error('Error deleting image:', error);
      }
    });
    
  }  
  
}

