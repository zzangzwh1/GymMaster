import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

    private dotnetMemberUrl = 'https://localhost:7298/api/Member';

  constructor(private http: HttpClient) { }

  checkUserExists(userId: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.dotnetMemberUrl}/userId?userId=${userId}`);
  }
 
  login(loginInfo: any): Observable<any> {
    console.log(loginInfo);
   // const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.dotnetMemberUrl}/authenticate`, loginInfo);
  }

  register(userInfo: any): Observable<any> {
    return this.http.post(`${this.dotnetMemberUrl}/register`, userInfo);
  }
}
