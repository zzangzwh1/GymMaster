import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { boardComment,MemberAndCommentInfoDTO,ShareBoardImages } from '../interfaces/interface';




@Injectable({
  providedIn: 'root'
})
export class GetComment {

    public dotnetImageUrl = 'https://localhost:7298/api/BoardComment/';
    constructor(private http: HttpClient) { 
    }  
  
    public addComment(comment: boardComment): Observable<boardComment> {
        return this.http.post<boardComment>(`${this.dotnetImageUrl}AddComment`, comment);
    }
    public getComments(images:ShareBoardImages[]): Observable<MemberAndCommentInfoDTO[]>
    {
      return this.http.post<MemberAndCommentInfoDTO[]>(`${this.dotnetImageUrl}GetComments`,images)
    }
    public editComment(comment: boardComment): Observable<any> {
      const url = `${this.dotnetImageUrl}${comment.boardCommentId}`; 
      return this.http.put(url, comment);
    }
    public deleteComment(boardCommendId: number): Observable<any> {
      const url = `${this.dotnetImageUrl}delete/${boardCommendId}`; 
      return this.http.put(url, {});
    }
  
  }
  