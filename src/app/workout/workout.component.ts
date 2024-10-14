import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup,Validators  } from '@angular/forms';
import { combineLatest, Observable ,} from 'rxjs';
import { startWith } from 'rxjs/operators';
import { WorkoutData, WorkoutInfo, WorkoutSetDTO } from '../interfaces/interface';
import { AuthService } from '../Service/auth.service';
import { Workout } from '../Service/workout.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-workout',
  templateUrl: './workout.component.html',
  styleUrls: ['./workout.component.css'],
})
export class WorkoutComponent implements OnInit {
  public form: FormGroup;
  public exercises: string[] = ['Chest', 'Back', 'Leg', 'Shoulder', 'Arms'];
  public display: string = 'none';
  public displayTable: string = 'none';
  public currentExercise: string = '';
  public parentWorkoutData: WorkoutData = {
    selectPart: '',   
    selectdate: '',
    selectExerciseDescription: ''
  };
  private productCount :any[] =[]; 
  private productDesc : any[] = [];
  private rowChanges : WorkoutInfo[] = [];
  private rowTotals = [];
  private WorkoutData : WorkoutSetDTO ={
    MemberId : 0,
    Part :'',
   SetCount :0,
   RepCount :0,
   Weight :0,
    SetDescription : '',
    CreationDate : '',
    ExpirationDate: '',
    LastModified : '' 
  }
  private workoutDataList: WorkoutSetDTO[] = [];

  
  private memberId :string= '';
  constructor(
    private fb: FormBuilder, private auth : AuthService , private works : Workout, private router :Router
  ) {
    this.form = this.fb.group({
      exercise: ['', Validators.required], 
      date: ['', Validators.required],      
      time: ['', Validators.required]    
    });
  }

  ngOnInit(): void {
   if(sessionStorage.getItem('userId') !==null){

  
    const exerciseControl = this.form.get('exercise');
    const dateControl = this.form.get('date');


    if (exerciseControl && dateControl) {
      const initialExerciseValue = exerciseControl.value;
      const initialDateValue = dateControl.value;


      combineLatest([
        exerciseControl.valueChanges.pipe(startWith(initialExerciseValue)),
        dateControl.valueChanges.pipe(startWith(initialDateValue))
    
      ]).subscribe(([selectedExercise, selectedDate]) => {
        this.parentWorkoutData.selectPart = selectedExercise;      
        this.parentWorkoutData.selectdate = selectedDate;
       
        // Handle the display logic
        this.display = selectedExercise ? '' : 'none';
      });
    }
  }
  else{
    alert('You Must Login If you want to log your daily work out!');
  }
  }

  currentInputValue(): string {
    if(this.form.get('date')?.value === ''){
      alert('Please Select Date  ');
      return '';
    }
    else{
      this.displayTable = this.currentExercise.trim().length > 0 ? 'block' : 'none';    
      this.parentWorkoutData.selectExerciseDescription = this.currentExercise;
  
      console.log(this.currentExercise);
      return this.currentExercise;  
     
    }   
    
  }
  public getCurrentDateWithoutTime(): Date {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), today.getDate());
  }
  public countChange(products: any[]): void { 
    console.log('~~@fsefs',products);
    this.productCount= products;

  } 

  public UploadExercise(): void {

    if (!this.form.valid) {
      console.log('Form is invalid.');
      return;
    }
  
    const userId = sessionStorage.getItem('userId');
    if (!userId) {
      console.warn('User ID is not found in session storage.');
      return;
    }
  
    this.auth.getMemberIdByUserID(userId).subscribe(
      (memberId: string) => {
          // Ensure workoutDataList is initialized as an empty array
          this.workoutDataList = [];
  
          console.log('TEST~~');
          for (let i = 0; i < this.productCount.length; i++) {
            const workoutSet: WorkoutSetDTO = {
              MemberId: Number(memberId), // Ensure memberId is converted to a number
              Part: this.parentWorkoutData.selectPart || '',
              SetCount: this.productCount[i].setCount,
              RepCount: this.productCount[i].repCount,
              Weight: this.productCount[i].weight,
              SetDescription: this.productCount[i].description,
              CreationDate: this.parentWorkoutData.selectdate, // This is a string now
              ExpirationDate: this.formatDate(new Date(2099, 10, 31)), // This is a string now
              LastModified: this.parentWorkoutData.selectdate // This is a string now
          };
  
              this.workoutDataList.push(workoutSet);
            }
            this.insertWorkoutData(this.workoutDataList);
      },
      (error) => {
          console.error('Error fetching member ID:', error);
      }
  );
  }
  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0]; // This gives YYYY-MM-DD format
}



  public insertWorkoutData(workoutSet: WorkoutSetDTO[]): void {
    // Log the workoutSet to see what data is being sent
    console.log('WorkoutSet data to be inserted:', workoutSet);
    
    // Call the service method to insert the workout set
    this.works.insertWorkoutSet(workoutSet).subscribe({
        next: (response) => {
            console.log('Insert successful:', response);
            alert('Workout Successfully Updated!');
            window.location.reload();
        },
        error: (error) => {
            // Log the complete error response for debugging
            console.error('Insert failed:', error);

            // Check if error has validation errors and log them
            if (error.error && error.error.errors) {
                console.error('Validation errors:', error.error.errors);
            } else {
                console.error('An unexpected error occurred:', error.message);
            }

            // Handle error (e.g., show an error message to the user)
            // You might want to implement a user-friendly notification system here
        }
    });
}
  

}
