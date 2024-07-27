import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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

  constructor(
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      exercise: [''],
      date: [''],
      time: ['']
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
    
    this.displayTable = this.currentExercise.trim().length > 0 ? 'block' : 'none';
    // Assign currentExercise to selectExerciseDescription
    this.parentWorkoutData.selectExerciseDescription = this.currentExercise;
    console.log(this.currentExercise);
 
    return this.currentExercise;
  }
}
