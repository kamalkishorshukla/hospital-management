import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Appointment, AppointmentDto } from '../models/appointment.model';
import { DashboardStats } from '../models/dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private apiUrl = `${environment.apiUrl}/appointments`;

  constructor(private http: HttpClient) {}

  getAppointments(status?: string, date?: string): Observable<Appointment[]> {
    let params = new HttpParams();
    if (status) params = params.set('status', status);
    if (date) params = params.set('date', date);
    return this.http.get<Appointment[]>(this.apiUrl, { params });
  }

  getAppointment(id: number): Observable<Appointment> {
    return this.http.get<Appointment>(`${this.apiUrl}/${id}`);
  }

  createAppointment(dto: AppointmentDto): Observable<Appointment> {
    return this.http.post<Appointment>(this.apiUrl, dto);
  }

  updateAppointment(id: number, dto: AppointmentDto): Observable<Appointment> {
    return this.http.put<Appointment>(`${this.apiUrl}/${id}`, dto);
  }

  updateStatus(id: number, status: string): Observable<{ message: string; status: string }> {
    return this.http.patch<{ message: string; status: string }>(`${this.apiUrl}/${id}/status`, JSON.stringify(status), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  deleteAppointment(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }

  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}/dashboard-stats`);
  }
}
