import { Component, Input, OnChanges } from '@angular/core';
import { ChartType, ChartOptions } from 'chart.js';
import { SingleDataSet, Label } from 'ng2-charts';

@Component({
  selector: 'app-chart-container',
  templateUrl: './chart-container.component.html'
})
export class ChartContainerComponent implements OnChanges {
  @Input() barData!: number[];
  @Input() pieData!: number[];
  @Input() lineData!: number[];

  // Bar Chart
  public barChartOptions: ChartOptions = { responsive: true };
  public barChartLabels: Label[] = ['Jan', 'Feb', 'Mar'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartData = [{ data: [], label: 'Reports' }];

  // Pie Chart
  public pieChartLabels: Label[] = ['Category A', 'Category B', 'Category C'];
  public pieChartData: SingleDataSet = [];
  public pieChartType: ChartType = 'pie';

  // Line Chart
  public lineChartLabels: Label[] = ['Week 1', 'Week 2', 'Week 3'];
  public lineChartData = [{ data: [], label: 'Trend' }];
  public lineChartType: ChartType = 'line';

  ngOnChanges(): void {
    this.barChartData[0].data = this.barData;
    this.pieChartData = this.pieData;
    this.lineChartData[0].data = this.lineData;
  }
}
