import { Component,OnInit } from '@angular/core';
import { Chart,registerables } from 'chart.js';
import { Workout } from '../../Service/workout.service';
import { GetMemberWorkoutStatus } from '../../class/helpClass';
import { PartCount } from '../../interfaces/interface';
import { Observable } from 'rxjs';

Chart.register(...registerables);

@Component({
  selector: 'app-my-chart',
  templateUrl: './my-chart.component.html',
  styleUrl: './my-chart.component.css'
})
export class MyChartComponent implements OnInit {
  
 
  public datas:any; 
   public configs : any = {
    type: 'doughnut',
    data: this.WorkoutStatus(),
  };
  

  public labels = ['Jan','FEB','Mar','April','May','June'];
  public data :any; 

  public config :any = {
    type: 'bar',
    data: this.WorkoutTrack(),
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    },
  };
  public chart :any;
  public charts :any;

  constructor(private work : Workout, private getMemberWorkout:GetMemberWorkoutStatus) {   
  
  }

  ngOnInit(): void {
  //this.data = this.WorkoutTrack();
  this.chart = new Chart('myChart',this.config);
  this.charts = new Chart('myChart2',this.configs);
   
}
public  WorkoutTrack() : any{
  console.log(sessionStorage.getItem('userId'));
  //let getChestMonthlyValue = 
  this.data = {
    labels: this.labels,
    datasets: [{
      label: 'My First Dataset',
      data: [65, 59, 80, 81, 56, 55, 40],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(255, 205, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(201, 203, 207, 0.2)'
      ],
      borderColor: [
        'rgb(255, 99, 132)',
        'rgb(255, 159, 64)',
        'rgb(255, 205, 86)',
        'rgb(75, 192, 192)',
        'rgb(54, 162, 235)',
        'rgb(153, 102, 255)',
        'rgb(201, 203, 207)'
      ],
      borderWidth: 1
    }]
  };
  return this.data;

}
public WorkoutStatus() :any{
  const userId = sessionStorage.getItem('userId');
  this.getMemberWorkout = new GetMemberWorkoutStatus();
  this.getMemberWorkout.part = ['Chest', 'Back', 'Leg', 'Shoulder', 'Arms'];
  if (userId !== null) {
    this.getMemberWorkout.userId = userId;
    let monthlyMemberWorkoutStatus :Observable< PartCount[]> = this.work.getMemberWorkoutStatus(userId);
  
    
    console.log('TEST---',monthlyMemberWorkoutStatus);

    this.datas = {
      labels: [
        'Chest',
        'Back',
        'Leg',
        'Shoulder',
        'Arms'
      ],
      datasets: [{
        label: 'My Monthly Workout Data',
        data: [10,15,25,39,45],
        backgroundColor: [
          'rgb(255, 0, 0)',
          'rgb(0, 255, 0)',
          'rgb(0, 0, 255)',
          'rgb(255, 165, 0)',
          'rgb(128, 0, 128)'
        ],
        hoverOffset: 4
      }]
    };
  }
  console.log(this.getMemberWorkout);
  
 
   return this.datas
}




}