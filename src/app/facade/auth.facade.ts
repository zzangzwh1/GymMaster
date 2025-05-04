import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { checkUserExists,getMemberById } from '../store/auth/auth.actions';
import { selectUserExists, selectMember } from '../store/auth/auth.selector';
import { Observable, of } from 'rxjs';
import { filter, skip, switchMap, take, takeLast } from 'rxjs/operators';
import { MemberDTO } from '../interfaces/interface';

@Injectable({ providedIn: 'root' })
export class AuthFacade {
  constructor(private store: Store) {}

 checkIfUserExists(userId: string) {
    this.store.dispatch(checkUserExists({ userId }));
  }
  getUserExistenceStatus(): Observable<MemberDTO | null> {
    return this.store.select(selectUserExists).pipe(
        filter((member): member is MemberDTO => member !== null),
        take(1) 
    );
  }

  getMemberByUserId(userId: string) {
    this.store.dispatch(getMemberById({ userId }));
  }
  getMemberExistenceStatus(): Observable<MemberDTO> {
    return this.store.select(selectMember).pipe(
      filter((member): member is MemberDTO => member !== null),
      take(1) 
    );
  }
  
  
  
  
  
  
}