import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../../environments/environment';
import { Report } from '../models/report.model';

@Injectable({ providedIn: 'root' })
export class SocketService {
  private socket: Socket;

  constructor() {
    this.socket = io(environment.socketUrl || '/');
  }

  onNewReport(callback: (report: Report) => void): void {
    this.socket.on('nuevo-reporte', callback);
  }

  disconnect(): void {
    this.socket.disconnect();
  }
}
