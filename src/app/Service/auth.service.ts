import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

    private dotnetMemberUrl = 'https://localhost:7298/api/Member/';

  constructor(private http: HttpClient) { }

  checkUserExists(userId: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.dotnetMemberUrl}userId?userId=${userId}`);
  }
 
  login(userInfo: any): Observable<any> {
    console.log('userinfo: ',userInfo);
    return this.http.post(`${this.dotnetMemberUrl}authenticate`, userInfo);
  }

  register(userInfo: any): Observable<any> {
    return this.http.post(`${this.dotnetMemberUrl}register`, userInfo);
  }
}
