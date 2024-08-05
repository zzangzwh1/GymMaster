import { Component, OnInit ,EventEmitter, Output, output } from '@angular/core';
import { WorkoutInfo} from '../../interfaces/interface';
@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {

  @Output() dataChange: EventEmitter<WorkoutInfo[]> = new EventEmitter<WorkoutInfo[]>();
 
  someData: any; 
  public products: { setCount: number, repCount: number, weight:number, description: string }[] = [];
  private countArr: WorkoutInfo[] = []; // Maintain state of countArr

  constructor() {   
  this.products.push({ setCount: 1, repCount: 0,weight:0, description: '' });
       
  }
  addRow() {
    let countArr = [];
    const newRow = {
      setCount: this.products.length + 1, // Example logic for setCount
      repCount: 0,
      weight:0,
      description: ''
    };
    this.products.push(newRow); 
      
    console.log('AddROw',this.products);
  }

  ngOnInit(): void { 
  }

  onRepCountChange(index: any): void {
    // Create the new RepCount object
    let newRepCount: WorkoutInfo = {
      setCount: this.products.length,
      repCount: this.products[index].repCount,
      weight : this.products[index].weight,
      description :this.products[index].description
  
    };
    console.log('~~~~~~~~~~~~',newRepCount);

    // Check if the countArr needs to be updated
    const existingRepCount = this.countArr.find(item => item.setCount === newRepCount.setCount);

    if (existingRepCount) {
      // Update existing item in countArr
      existingRepCount.repCount = newRepCount.repCount;
      existingRepCount.weight = newRepCount.weight;
      existingRepCount.description =newRepCount.description;
    } else {
      // Add new item if it doesn't exist
      this.countArr.push(newRepCount);
    }

    // Emit only if there is a change
    this.dataChange.emit(this.countArr);

    console.log('Updated countArr:', this.countArr);
  }  

}


