import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { Subject } from 'rxjs';
import {  IImageLikeCountDTO, MemberAndCommentInfoDTO,ShareBoardImages } from '../interfaces/interface';

@Injectable({
  providedIn: 'root'
})
export class SignalrService {
  private hubConnection: HubConnection | undefined;
   private commentHub: HubConnection | undefined;
   private imageHub: HubConnection | undefined;
  private likeCountSubject = new Subject<IImageLikeCountDTO[]>();  
  private commentSubject = new Subject<MemberAndCommentInfoDTO[]>();
  private imageSubject = new Subject<ShareBoardImages[]>();
  public likeCount$ = this.likeCountSubject.asObservable();
  public comment$ = this.commentSubject.asObservable();
  public image$ = this.imageSubject.asObservable();
  constructor() { }

  //Like Signal R
  public startConnection(): void {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl('https://localhost:7298/SHub')  
      .build();

    this.hubConnection.start()
      .then(() => console.log('SignalR Connection Established'))
      .catch((err) => console.error('Error establishing connection', err));
  }


  public listenForLikeCountUpdate(): void {
    console.log('TEST~');
    if (this.hubConnection) {
      this.hubConnection.on('ReceiveLikeCountUpdate', (likeCounts: any) => {
        this.likeCountSubject.next(likeCounts);  
      });
    }
  }

  //COmment Singal R
  public startCommentHubConnection(): void {
    this.commentHub = new HubConnectionBuilder()
      .withUrl('https://localhost:7298/CommentHub')
      .build();

    this.commentHub.start()
      .then(() => console.log('CommentHub connected'))
      .catch((err) => console.error('CommentHub error:', err));
  }
  public listenForCommentUpdate(): void {
    if (this.commentHub) {
        console.log('listenForCommentUpdate~~~~~~~~~');
      this.commentHub.on('ReceiveComment', (comment: any) => {
        this.commentSubject.next(comment);
      });
    }
  }

  //Image hub
  public startImageConnection(): void {
    this.imageHub = new HubConnectionBuilder()
      .withUrl('https://localhost:7298/ImageHub')  
      .build();

    this.imageHub.start()
      .then(() => console.log('SignalR Connection Established'))
      .catch((err) => console.error('Error establishing connection', err));
  }


  public listenForImage(): void {
    console.log('TEST~');
    if (this.imageHub) {
      this.imageHub.on('ReceiveImage', (images: any) => {
        this.imageSubject.next(images);  
      });
    }
  }
}
