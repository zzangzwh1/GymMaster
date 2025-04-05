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
  public username :string|null ='';
  private workoutDataList: WorkoutSetDTO[] = [];
  maxDate: Date = new Date();
 
  constructor(
    private fb: FormBuilder, private auth : AuthService , private works : Workout, private router :Router
  ) {
    this.form = this.fb.group({
      exercise: ['', Validators.required], 
      date: ['', Validators.required]     
   
    });
  }

  ngOnInit(): void {
    this.username = sessionStorage.getItem('userId')
   if(this.username !==null){  
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
       
     
        this.display = selectedExercise ? '' : 'none';
      });
    }
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
          
          this.workoutDataList = [];
  
          for (let i = 0; i < this.productCount.length; i++) {
            const workoutSet: WorkoutSetDTO = {
              MemberId: Number(memberId), 
              Part: this.parentWorkoutData.selectPart || '',
              SetCount: this.productCount[i].setCount,
              RepCount: this.productCount[i].repCount,
              Weight: this.productCount[i].weight,
              SetDescription: this.productCount[i].description,
              CreationDate: this.parentWorkoutData.selectdate,
              ExpirationDate: this.formatDate(new Date(2099, 10, 31)),
              LastModified: this.parentWorkoutData.selectdate 
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
    return date.toISOString().split('T')[0]; 
}



  public insertWorkoutData(workoutSet: WorkoutSetDTO[]): void {
    
    console.log('WorkoutSet data to be inserted:', workoutSet);
    
   
    this.works.insertWorkoutSet(workoutSet).subscribe({
        next: (response) => {
            console.log('Insert successful:', response);
            alert('Workout Successfully Updated!');
            window.location.reload();
        },
        error: (error) => {
           
            console.error('Insert failed:', error);


            if (error.error && error.error.errors) {
                console.error('Validation errors:', error.error.errors);
            } else {
                console.error('An unexpected error occurred:', error.message);
            }

        }
    });
}
  

}
