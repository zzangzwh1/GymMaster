import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { Subject } from 'rxjs';
import {  IImageLikeCountDTO } from '../interfaces/interface';

@Injectable({
  providedIn: 'root'
})
export class SignalrService {
  private hubConnection: HubConnection | undefined;
  private likeCountSubject = new Subject<IImageLikeCountDTO[]>();  
  public likeCount$ = this.likeCountSubject.asObservable();

  constructor() { }

  
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
}
