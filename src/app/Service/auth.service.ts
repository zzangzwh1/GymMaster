import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import {
  AuthResponse,
  WorkoutSetDTO,
  MemberDTO,
} from '../interfaces/interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private dotnetMemberUrl = 'https://localhost:7298/api/Member';
  private loggedIn = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {
    this.checkLoginStatus();
  }

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  public checkUserExists(userId: string): Observable<boolean> {
    return this.http.get<boolean>(
      `${this.dotnetMemberUrl}/userId?userId=${userId}`
    );
  }
  public login(loginInfo: any): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.dotnetMemberUrl}/authenticate`, loginInfo, {
        withCredentials: true,
      })
      .pipe(
        tap((response) => {
          if (response.success) {
            sessionStorage.setItem('userId', loginInfo.userId);
            this.loggedIn.next(true);
          }
        })
      );
  }
  public register(userInfo: any): Observable<any> {
    return this.http.post(`${this.dotnetMemberUrl}/register`, userInfo);
  }

  public logout(): void {
    sessionStorage.removeItem('userId');
    this.loggedIn.next(false);
  }

  public checkLoginStatus(): void {
    const userId = sessionStorage.getItem('userId');
    this.loggedIn.next(userId !== null);
  }
  public getMemberIdByUserID(memberId: string): Observable<any> {
    return this.http.get<any>(
      `${this.dotnetMemberUrl}/memberId?memberId=${memberId}`
    );
  }
  public getMemberByUserName(userId: string): Observable<MemberDTO> {
    return this.http.get<MemberDTO>(
      `${this.dotnetMemberUrl}/userId?userId=${userId}`
    );
  }

  public updateUserInfo(member: MemberDTO): Observable<MemberDTO> {
    
    return this.http.post<MemberDTO>(`${this.dotnetMemberUrl}/edit`, member, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
}
