import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import {IResult, ShareBoardImages } from '../interfaces/interface';
import { map } from 'rxjs/operators';
import { ImageLike } from '../interfaces/interface';



@Injectable({
  providedIn: 'root'
})
export class GetImage {

    public dotnetImageUrl = 'https://localhost:7298/api/Image/';
   // https://localhost:7298/api/Image/memberId?memberId=1
    constructor(private http: HttpClient) { 
    }  
  
    public getMemberImage(memberId: number): Observable<ShareBoardImages[]> {
        return this.http.get<ShareBoardImages[]>(this.dotnetImageUrl+`memberId?memberId=${memberId}`);
    }
    public getImages(): Observable<ShareBoardImages[]> {
        return this.http.get<ShareBoardImages[]>(this.dotnetImageUrl);
    }
    public uploadImageLike(imageData: ImageLike): Observable<IResult> {
      return this.http.post<IResult>(this.dotnetImageUrl +'uploadImageLike', imageData);
    }
    public getlikedImages(member:string) : Observable<ImageLike[]>{      
          return this.http.get<ImageLike[]>(this.dotnetImageUrl +`member?member=${member}`);
    }
    public deleteImage(shareBoardId: number): Observable<ShareBoardImages> {
      return this.http.delete<ShareBoardImages>(`${this.dotnetImageUrl}Delete?shareBoardId=${shareBoardId}`);
    }
    
    
      
      
 
  }
  