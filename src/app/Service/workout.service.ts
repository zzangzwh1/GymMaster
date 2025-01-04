import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable ,throwError } from 'rxjs';

import {AuthResponse, WorkoutSetDTO,PartCount, YearCount } from '../interfaces/interface'
import { GetMemberWorkoutStatus } from '../class/helpClass';
import { catchError, tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class Workout {

    private dotnetWorkoutSetrUrl = 'https://localhost:7298/api/WorkoutSet';
 
    constructor(private http: HttpClient) { 
    }  
    public insertWorkoutSet(workoutInfo: WorkoutSetDTO[]): Observable<WorkoutSetDTO[]> {
      // Return the Observable from the HTTP POST request
      return this.http.post<WorkoutSetDTO[]>(`${this.dotnetWorkoutSetrUrl}/insertWorkout`, workoutInfo).pipe(
          tap(response => {
              console.log('Insert successful:', response);             
          }),
          catchError(error => {
              console.error('Insert failed:', error);
              if (error.error && error.error.errors) {
                  console.error('Validation errors:', error.error.errors); 
              }
           
              return throwError(error);
          })
      );
  }
    
    public getMemberWorkoutStatus(userId:string) :Observable<PartCount[]>
    {
      return this.http.get<PartCount[]>(`${this.dotnetWorkoutSetrUrl}/userId?userId=${userId}`);       

    }
    public getAnnualWorkoutStatus(userId:string) :Observable<YearCount[]> 
    {
      return this.http.get<YearCount[]>(`${this.dotnetWorkoutSetrUrl}/id?id=${userId}`);       

    }
    
  }
  