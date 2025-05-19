import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { Subject } from 'rxjs';
import {   ImageLike, MemberAndCommentInfoDTO,ShareBoardImages } from '../interfaces/interface';

@Injectable({
  providedIn: 'root'
})
export class SignalrService {
  private hubConnection: HubConnection | undefined;
   private commentHub: HubConnection | undefined;
   private imageHub: HubConnection | undefined;
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

 // SHub (Like count)
 public startConnection(): void {
  this.hubConnection = this.createHubConnection('https://localhost:7298/SHub');

  this.hubConnection
    .start()
    .then(() => console.log('SHub connected'))
    .catch(err => console.error('SHub connection error:', err));
}

public listenForLikeCountUpdate(): void {
  this.hubConnection?.on('ReceiveLikeCountUpdate', (likeCounts: ImageLike[]) => {
    this.likeCountSubject.next(likeCounts);
  });
}

// CommentHub
public startCommentHubConnection(): void {
  this.commentHub = this.createHubConnection('https://localhost:7298/CommentHub');

  this.commentHub
    .start()
    .then(() => console.log('CommentHub connected'))
    .catch(err => console.error('CommentHub error:', err));
}

public listenForCommentUpdate(): void {
  this.commentHub?.on('ReceiveComment', (comment: MemberAndCommentInfoDTO[]) => {
    this.commentSubject.next(comment);
  });
}

// ImageHub
public startImageConnection(): void {
  this.imageHub = this.createHubConnection('https://localhost:7298/ImageHub');

  this.imageHub
    .start()
    .then(() => console.log('ImageHub connected'))
    .catch(err => console.error('ImageHub connection error:', err));
}

public listenForImage(): void {
  this.imageHub?.on('ReceiveImage', (images: ShareBoardImages[]) => {
    this.imageSubject.next(images);
  });
}

}
