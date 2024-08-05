import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import {AuthResponse, WorkoutSet } from '../interfaces/interface'

@Injectable({
  providedIn: 'root'
})
export class Workout {

    private dotnetMemberUrl = 'https://localhost:7298/api/WorkoutSet';
 
    constructor(private http: HttpClient) {
   
    }
  
    public updateWorkoutSet(workoustSet: WorkoutSet) : void{
        this.http.post(`${this.dotnetMemberUrl}/WorkoutSet`, workoustSet).subscribe({
            next: (response) => {
              console.log('Update successful:', response);
              // Handle success
            },
            error: (error) => {
              console.error('Update failed:', error);
              // Handle error
            }
          });
    }
    
  }
  