import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { FormBuilder, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-workout',
  templateUrl: './workout.component.html',
  styleUrl: './workout.component.css',
  encapsulation: ViewEncapsulation.None
})
export class WorkoutComponent {
  form: FormGroup;
  days: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

 constructor(private router: Router, private titleService: Title,private fb: FormBuilder){
  titleService.setTitle('Workout');
  this.form = this.fb.group({
    day: [''],
    date: [''],
    time: [''],
  });
 }

}
