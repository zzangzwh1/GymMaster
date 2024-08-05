import { Component,OnInit } from '@angular/core';
import { Chart,registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-my-chart',
  templateUrl: './my-chart.component.html',
  styleUrl: './my-chart.component.css'
})
export class MyChartComponent implements OnInit {
  public datas = {
    labels: [
      'Chest',
      'Back',
      'Leg',
      'Shoulder',
      'Arms'
    ],
    datasets: [{
      label: 'My Monthly Workout Data',
      data: [200, 5, 1,19,10],
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
  public configs : any = {
    type: 'doughnut',
    data: this.datas,
  };
  

  public labels = ['Jan','FEB','Mar','April','May','June'];
  public data = {
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
  // </block:setup>
  
  // <block:config:0>
  public config :any = {
    type: 'bar',
    data: this.data,
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

  ngOnInit(): void {
  this.chart = new Chart('myChart',this.config);
    this.charts = new Chart('myChart2',this.configs);
 
  
}


}