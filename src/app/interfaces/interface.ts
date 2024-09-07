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
  export interface WorkoutInfo{
    setCount: number;
    repCount: number;
    weight : number,
    description: string;
  }
  export interface WorkoutSet{
    memberId : number,
    part : string,
    setCount : number,
    repCount :number,
    weight :number,
    SetDescription :string,
    CreationDate: Date  
  }

export interface PartCount {
  part: string;
  totalCount: number;
}
export interface YearCount {
  year: number;
  yearCount: number;
}
export interface UploadEvent {
  originalEvent: Event;
  files: File[];
}
export interface UploadImage{
  memberId :number,
  formData :FormData | null
}




