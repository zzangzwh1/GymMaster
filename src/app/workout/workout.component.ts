import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup,Validators  } from '@angular/forms';
import { combineLatest, Observable } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { WorkoutData, WorkoutInfo, WorkoutSet } from '../interfaces/interface';
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
    selectTime: '',
    selectdate: '',
    selectExerciseDescription: ''
  };
  private productCount :any[] =[]; 
  private productDesc : any[] = [];
  private rowChanges : WorkoutInfo[] = [];
  private rowTotals = [];
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
    const timeControl = this.form.get('time'); 

    if (exerciseControl && dateControl && timeControl) {
      const initialExerciseValue = exerciseControl.value;
      const initialDateValue = dateControl.value;
      const initialTimeValue = timeControl.value;

      combineLatest([
        exerciseControl.valueChanges.pipe(startWith(initialExerciseValue)),
        dateControl.valueChanges.pipe(startWith(initialDateValue)),
        timeControl.valueChanges.pipe(startWith(initialTimeValue))
      ]).subscribe(([selectedExercise, selectedDate, selectedTime]) => {
        this.parentWorkoutData.selectPart = selectedExercise;
        this.parentWorkoutData.selectTime = selectedTime;
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
    if(this.form.get('date')?.value === '' ||this.form.get('time')?.value === ''){
      alert('Please Select Date and Time');
      return '';
    }
    else{
      this.displayTable = this.currentExercise.trim().length > 0 ? 'block' : 'none';    
      this.parentWorkoutData.selectExerciseDescription = this.currentExercise;
  
      console.log(this.currentExercise);
      return this.currentExercise;  
     
    }   
    
  }
  public countChange(products: any[]): void { 
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
        this.memberId = memberId;
        console.log('Current Member ID:', this.memberId);
        this.processWorkoutData();
      },
      (error) => {
        console.error('Error fetching member ID:', error);
      }
    );
  }
  
  private processWorkoutData(): void {
    const dateOnly = this.formatDate(this.form.get('date')?.value);
    
  
    this.productCount.forEach((product) => {
      const workoutInfo: WorkoutSet = {
        memberId: Number(this.memberId),
        part: this.form.get('exercise')?.value || '',
        CreationDate: dateOnly, 
        repCount: product.repCount,
        setCount: product.setCount,
        weight :product.weight,
        SetDescription: product.description
      };
  
      console.log('Processing workout info:', workoutInfo);
      this.works.updateWorkoutSet(workoutInfo);
    });
  
    alert('Workout Successfully Updated!');
    window.location.reload();
  }
  
  private formatDate(dateValue: any): Date {
    if (!(dateValue instanceof Date)) {
      console.error('Invalid date value');
      return new Date(); 
    }    
    return dateValue;
  }
}
