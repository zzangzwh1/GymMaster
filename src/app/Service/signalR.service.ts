import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { Subject } from 'rxjs';
import { ImageLike, MemberAndCommentInfoDTO,ShareBoardImages } from '../interfaces/interface';

@Injectable({
  providedIn: 'root'
})
export class SignalrService {
  private hubConnection: HubConnection | undefined;
  private likeCountSubject = new Subject<ImageLike[]>();  
  private commentSubject = new Subject<MemberAndCommentInfoDTO[]>();
  private imageSubject = new Subject<ShareBoardImages[]>();
  public likeCount$ = this.likeCountSubject.asObservable();
  public comment$ = this.commentSubject.asObservable();
  public image$ = this.imageSubject.asObservable();
  constructor() { }

  private getToken(): string {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      throw new Error('JWT token not found in local storage.');
    }
    return token;
  }
  private createHubConnection(url: string): HubConnection {
    return new HubConnectionBuilder()
      .withUrl(url, {
        accessTokenFactory: () => this.getToken()
      })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();
  }

 // Signal R Hub Connection
 public startConnection(): void {
  this.hubConnection = this.createHubConnection('https://localhost:7298/SHub');

  this.hubConnection
    .start()
    .then(() => console.log('SHub connected'))
    .catch(err => console.error('SHub connection error:', err));
}
// real time like count increase/Decrease
public listenForLikeCountUpdate(): void {
  this.hubConnection?.on('ReceiveLikeCountUpdate', (likeCounts: ImageLike[]) => {
    this.likeCountSubject.next(likeCounts);
  });
}
// real time comments for iamgages
public listenForCommentUpdate(): void {
  this.hubConnection?.on('ReceiveComment', (comment: MemberAndCommentInfoDTO[]) => {
    this.commentSubject.next(comment);
  });
}
// real time image upload
public listenForImage(): void {
  this.hubConnection?.on('ReceiveImage', (images: ShareBoardImages[]) => {
    this.imageSubject.next(images);
  });
}

}
