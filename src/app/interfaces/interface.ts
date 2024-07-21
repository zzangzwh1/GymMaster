import { Time } from "@angular/common";

export interface Login{
    userId : '',
    password : ''
  } ;
  export interface AuthResponse {
    success: boolean;
    message?: string;
  }

  export interface WorkoutData{
    selectPart? : string,
    selectdate? : string,
    selectTime? : string,
    selectExerciseDescription? :string
  }

