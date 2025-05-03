import { Component, OnInit } from '@angular/core';
import "primeicons/primeicons.css";
import { GetImage } from '../Service/images.service';
import { AuthService } from '../Service/auth.service';
import {  IImageLikeCountDTO, ShareBoardImages } from '../interfaces/interface';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ImageLike } from '../interfaces/interface';
import { boardComment,MemberAndCommentInfoDTO } from '../interfaces/interface';
import {GetComment} from '../Service/comment.service';
import { SignalrService } from '../Service/signalR.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

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
    userId : ''
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
groupImages : IImageLikeCountDTO[] = [];
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
  constructor(private auth: AuthService,private image : GetImage,private comments : GetComment, private titleService: Title,private router : Router,private signalrService: SignalrService) {
    this.isCommented = new Array(this.memberImages.length).fill(false);
    
  }  

  ngOnInit(): void {     
     this.signalR();    
    this.memberId = sessionStorage.getItem('userId') || '';     
 
    if(this.router.url.includes('Home'))
    { 
      this.isHome = true;  
      this.loadCurrentMemberImages(this.memberId);
 
    }
    else{   
      this.titleService.setTitle('Share');
      this.canScroll= true;
      this.memberImages.filter(i=> i.shareBoardId).length >0 ? this.currentImageShardBoardId = this.memberImages.filter(i=> i.shareBoardId).length -1 : 0     
      this.loadCurrentPageImages(this.currentImageShardBoardId ,this.page,this.memberId,true);

    }   

  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


  signalR():void {
    this.signalrService.startConnection();
    this.signalrService.listenForLikeCountUpdate();

    this.signalrService.startCommentHubConnection();
    this.signalrService.listenForCommentUpdate();

    
    this.signalrService.startImageConnection();
    this.signalrService.listenForImage();

    this.signalrService.image$.subscribe(images =>{
      this.memberImages = images;
    })
    this.signalrService.likeCount$.subscribe((likeCounts) => {
      this.groupImages = likeCounts;      
     
    });
  
    this.signalrService.comment$.subscribe(comment => {
    this.getCommentInfos = comment;
    });
    this.signalrService.image$.subscribe(images =>{
      this.memberImages = images;
    })

    this.image.getLikes().subscribe({
      next: (response) => {
         this.groupImages = response;
  
      },
      error: (err) => {
              console.error('Error fetching likes:', err);
      }
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
      next :() =>{   
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
    let likeData = this.groupImages.filter(g => g.shareBoardId === shareBoardId);
    return likeData.length > 0 ? likeData[0].totalCount : 0;
  }

  private loadCurrentMemberImages(memberId: string): void {
    this.isLoading= true;
    this.auth.getMemberIdByUserID(memberId).subscribe(
      (fetchedMemberId: string) => {
        this.currentMemberId = fetchedMemberId;
          this.image.getMemberImage(Number(fetchedMemberId)).subscribe(
          (images: ShareBoardImages[] | undefined) => {
            if (!images || images.length === 0) {        
           
              this.memberImages = [];            
            } else {           
              this.memberImages = images;                                       
              this.likedImages(this.memberId);
              this.getImageComments(images);                
           
           
            }
            this.isLoading= false;
          },
          (error) => this.handleError('Error fetching images', error)
        );
      },
      (error) => this.handleError('Error fetching member ID', error)
    );
    this.isLoading= false;
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

 public likeImage(image: ShareBoardImages): void {
   
 if(image.shareBoardId && this.memberId){
  this.addLike.shareBoardId = image.shareBoardId;
  this.addLike.userId = this.memberId;

  this.image.uploadImageLike(this.addLike).subscribe({
    next: (response) => {

     if (response.isSuccess && response.message ==='success') {      
       const result=  this.memberImages
          .filter(i => i.shareBoardId === image.shareBoardId)  
          .forEach(i => i.likeImage = true); 
               
      } else {          
        this.memberImages
          .filter(i => i.shareBoardId === image.shareBoardId)  
          .forEach(i => i.likeImage = false); 
                    
      }
      this.image.getLikes().subscribe({
        next: (response) => {
         this.groupImages = response;        
        },
        error: (err) => {        
          console.error('Error fetching likes:', err);
        }
      });
        
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
      this.loadCurrentPageImages(filteredShareBoard,this.page,this.memberId,true);  
    
    }
    if(atTop){   
      this.loadCurrentPageImages(filteredShareBoard,this.page,this.memberId,false);
    }
  }

  } 
  loadCurrentPageImages(shardBoardId: number, page: number, memberId: string, isScrollDown: boolean): Promise<void> {
    if (this.isLoading) {     
      return Promise.resolve();
    }    
    this.isLoading = true;  
    return new Promise((resolve, reject) => {
      const handleSuccess = (images: any[]) => {
        if (images.length > 0) {
          this.memberImages = [...images];
          this.likedImages(memberId);
          this.getImageComments(images);
          resolve();
        } else {
          console.error('No images found', images);
          reject();
        }
        this.isLoading = false;
      
      };  
      const handleError = (err: any) => {
        console.error('Error loading images', err);
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
        this.getImageComments(this.memberImages);
        inputElement.value ='';
      },
      error: (error) => {
        console.error('Failed to add comment:', error);
       
      }
    });
  }
  public getImageComments(images:ShareBoardImages[]): void {   
      this.comments.getComments(images).subscribe({
        next: (comments: MemberAndCommentInfoDTO[]) => {         
            this.getCommentInfos = comments;
          
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

