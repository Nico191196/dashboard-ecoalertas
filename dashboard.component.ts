import { Component, OnInit, OnDestroy } from '@angular/core';
import { formatDate } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Report } from '../../core/models/report.model';
import { ReportService } from '../../core/services/report.service';
import { SocketService } from '../../core/services/socket.service';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  reports: Report[] = [];
  filteredReports: Report[] = [];
  categories: string[] = [];
  statuses: string[] = [];
  filterCategory: string[] = [];
  filterStatus: string[] = [];
  searchTerm = '';
  dateRange: [Date | null, Date | null] = [null, null];
  darkMode = false;
  isLoading = true;
  isError = false;

  private destroy$ = new Subject<void>();

  constructor(
    private reportService: ReportService,
    private socketService: SocketService
  ) {}

  ngOnInit(): void {
    this.fetchReports();
    this.setupWebSocket();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.socketService.disconnect();
  }

  fetchReports(): void {
    this.reportService.getReports()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.reports = data;
          this.isLoading = false;
          this.extractFilters();
          this.applyFilters();
        },
        error: () => {
          this.isError = true;
          this.isLoading = false;
        }
      });
  }

  setupWebSocket(): void {
    this.socketService.onNewReport((newReport) => {
      this.reports = [newReport, ...this.reports];
      alert('New report received'); // Replace with toast later
      this.applyFilters();
    });
  }

  extractFilters(): void {
    const cats = [...new Set(this.reports.map(r => r.category))];
    const stats = [...new Set(this.reports.map(r => r.status))];
    this.categories = cats;
    this.statuses = stats;
  }

  applyFilters(): void {
    const [startDate, endDate] = this.dateRange;
    this.filteredReports = this.reports.filter(r => {
      const inCategory = !this.filterCategory.length || this.filterCategory.includes(r.category);
      const inStatus = !this.filterStatus.length || this.filterStatus.includes(r.status);
      const inSearch = r.description.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                       r.category.toLowerCase().includes(this.searchTerm.toLowerCase());
      const inDate = (!startDate || new Date(r.date) >= startDate!) &&
                     (!endDate || new Date(r.date) <= endDate!);
      return inCategory && inStatus && inSearch && inDate;
    });
  }

  exportCSV(): void {
    const header = ['ID', 'Category', 'Status', 'Date'].join(',');
    const rows = this.filteredReports.map(r =>
      [r.id, r.category, r.status, formatDate(r.date, 'yyyy-MM-dd', 'en-US')].join(',')
    );
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    FileSaver.saveAs(blob, 'reportes.csv');
  }

  toggleDarkMode(): void {
    this.darkMode = !this.darkMode;
  }
}
