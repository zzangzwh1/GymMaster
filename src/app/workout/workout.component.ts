import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup,Validators  } from '@angular/forms';
import { combineLatest } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { WorkoutData } from '../interfaces/interface';

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
  public productCount :any[] =[]; 

  constructor(
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      exercise: ['', Validators.required], 
      date: ['', Validators.required],      
      time: ['', Validators.required]    
    });
  }

  ngOnInit(): void {
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
        console.log(selectedExercise);
        console.log(selectedTime);
        console.log(selectedDate);
       
        // Handle the display logic
        this.display = selectedExercise ? '' : 'none';
      });
    }
  }

  currentInputValue(): string {
    if(this.form.get('date')?.value === '' ||this.form.get('time')?.value === ''){
      alert('Please Select Date and Time');
      return '';
    }
    else{
      this.displayTable = this.currentExercise.trim().length > 0 ? 'block' : 'none';
      // Assign currentExercise to selectExerciseDescription
      this.parentWorkoutData.selectExerciseDescription = this.currentExercise;
  
      console.log(this.currentExercise);
      return this.currentExercise;
  
     
    }
    
    
  }
  public countChange(products: any[]): void {
 
    console.log(products.length);
    console.log('TEST--------',products);
    this.productCount= products;

   // console.log('Products updated:', products);

    // Process the data as needed
    // For example, you could store it in a property or perform some actions
    // this.updatedProducts = products;
  }
 public descChange(products : any[]) :void{
    console.log('TEST2',products);
  }
 public UploadExercise():void{
  console.log('Test');
  console.log(this.productCount);
 
  if (this.form.valid) {
    
    console.log('Form is valid. Proceeding with upload.------------------');
    console.log('Selected Exercise:', this.form.get('exercise')?.value);
    console.log('Date:', this.form.get('date')?.value);
    console.log('Time:', this.form.get('time')?.value);
    console.log('current Product Count : ',this.productCount);
    // Add your upload logic here
  } else {
    console.log('Form is invalid.');
  }
  }
}
