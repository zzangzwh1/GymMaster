import { Component, ViewEncapsulation ,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { FormBuilder, FormGroup } from '@angular/forms';
import { combineLatest } from 'rxjs';
import { startWith } from 'rxjs/operators';



@Component({
  selector: 'app-workout',
  templateUrl: './workout.component.html',
  styleUrl: './workout.component.css',
  encapsulation: ViewEncapsulation.None
})
export class WorkoutComponent implements OnInit {
  public form: FormGroup;
  public exercises: string[] = ['Chest', 'Back', 'Leg', 'Shoulder', 'Arms'];
  public display: string = 'none';

 constructor(private router: Router, private titleService: Title,private fb: FormBuilder){
  titleService.setTitle('Workout');
  this.form = this.fb.group({
    exercise: [''],
    date: [''],
    time: [''],
  });
  
  
 }
 ngOnInit(): void {
  console.log(this.form.controls);
  
  const exerciseControl = this.form.get('exercise');
  const dateControl = this.form.get('date');
  const timeControl = this.form.get('time');
  
  if (exerciseControl && dateControl && timeControl) {
    // Log the initial values
    const initialExerciseValue = exerciseControl.value;
    const initialDateValue = dateControl.value;
    const inttialTimeValue = timeControl.value;
    console.log('Initial exercise:', initialExerciseValue);
    console.log('Initial date:', initialDateValue);

    console.log('Initial TIme:', inttialTimeValue);

    // Combine the latest value changes with initial values
    combineLatest([
      exerciseControl.valueChanges.pipe(startWith(initialExerciseValue)),
      dateControl.valueChanges.pipe(startWith(initialDateValue)),
      timeControl.valueChanges.pipe(startWith(inttialTimeValue))
    ]).subscribe(([selectedExercise, selectedDate,selectTime]) => {
      const currentExercise = selectedExercise;
      const currentDate = selectedDate;
      const currentTime = selectTime
      console.log(currentExercise);
      if( currentExercise !==''){
        this.display = '';
      }
      else{
        this.display = 'none';
      }

      console.log('Selected exercise:', currentExercise);
      console.log('Selected date:', currentDate);
      console.log('Select Time :',currentTime);
    });
  }
}

}
