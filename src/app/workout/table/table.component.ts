import { Component, OnInit ,EventEmitter, Output } from '@angular/core';
import { Description, RepCount } from '../../interfaces/interface';
@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {

  @Output() dataCountChange: EventEmitter<RepCount[]> = new EventEmitter<RepCount[]>();
  @Output() dataDescChange: EventEmitter<any> = new EventEmitter<any>();
  someData: any; 
  public products: { setCount: number, repCount: number, description: string }[] = [];
  private countArr: RepCount[] = []; // Maintain state of countArr

  constructor() {   
  this.products.push({ setCount: 1, repCount: 0, description: '' });
       
  }
  addRow() {
    let countArr = [];
    const newRow = {
      setCount: this.products.length + 1, // Example logic for setCount
      repCount: 0,
      description: ''
    };
    this.products.push(newRow);
    let rowInfo = [];
    if(newRow.setCount >1)
    {
      rowInfo.push(newRow);
      this.dataCountChange.emit(rowInfo);

    }
      
    console.log('AddROw',this.products);
  }

  ngOnInit(): void { 
  }

  onRepCountChange(index: number): void {
    // Create the new RepCount object
    let newRepCount: RepCount = {
      setCount: this.products.length,
      repCount: this.products[index].repCount
    };

    // Check if the countArr needs to be updated
    const existingRepCount = this.countArr.find(item => item.setCount === newRepCount.setCount);

    if (existingRepCount) {
      // Update existing item in countArr
      existingRepCount.repCount = newRepCount.repCount;
    } else {
      // Add new item if it doesn't exist
      this.countArr.push(newRepCount);
    }

    // Emit only if there is a change
    this.dataCountChange.emit(this.countArr);

    console.log('Updated countArr:', this.countArr);
  }

  onDescriptionChange(index: any): void {
    let descArr = [];
    let desc: Description =
    {
      description : this.products[index].description
    };
    if(descArr.length ==0){
      descArr.push(desc);
      this.dataDescChange.emit(descArr);

    }
     
  }

}


