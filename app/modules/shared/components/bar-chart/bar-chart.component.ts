import { Component, OnInit } from '@angular/core';
// Angular Chart Component
// Chart Options Type Interface
@Component({
  selector: 'bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})


export class BarChartComponent implements OnInit {

  name = 'Angular';
  width: number = 700;
  height: number = 300;
  fitContainer: boolean = false;

    view: any[] = [600, 400];
  // options for the chart
  showXAxis = true;
  showYAxis = true;
  gradient = true;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Country';
  showYAxisLabel = true;
  yAxisLabel = 'Sales';
  timeline = true;
  doughnut = true;
  colorScheme = {
    domain: ['#9370DB', '#87CEFA', '#FA8072', '#FF7F50', '#90EE90', '#9370DB']
  };
  //pie
  showLabels = true;
  // data goes here
public single = [
  {
    "name": "China",
    "value": 2243772
  },
  {
    "name": "USA",
    "value": 1126000
  },
  {
    "name": "Norway",
    "value": 296215
  },
  {
    "name": "Japan",
    "value": 257363
  },
  {
    "name": "Germany",
    "value": 196750
  },
  {
    "name": "France",
    "value": 204617
  }
];
  constructor() { 
  
  }

  ngOnInit(): void {
  }

}
