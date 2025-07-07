import { Component, AfterViewInit, Input } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map-container',
  templateUrl: './map-container.component.html'
})
export class MapContainerComponent implements AfterViewInit {
  @Input() reports: any[] = [];

  ngAfterViewInit(): void {
    const map = L.map('map').setView([39.8282, -98.5795], 4);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    this.reports.forEach(report => {
      L.marker([report.lat, report.lng])
        .addTo(map)
        .bindPopup(report.category);
    });
  }
}
