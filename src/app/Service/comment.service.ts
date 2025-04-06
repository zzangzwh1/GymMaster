import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { boardComment,MemberAndCommentInfoDTO } from '../interfaces/interface';




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
    public getCommentsAndMemberInfo(): Observable<MemberAndCommentInfoDTO[]>
    {
      return this.http.get<MemberAndCommentInfoDTO[]>(`${this.dotnetImageUrl}GetComments`)

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
  