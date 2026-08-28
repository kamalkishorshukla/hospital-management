import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AppointmentService } from '../../services/appointment.service';
import { DoctorService } from '../../services/doctor.service';
import { PatientService } from '../../services/patient.service';
import { Appointment, AppointmentDto } from '../../models/appointment.model';
import { Doctor } from '../../models/doctor.model';
import { Patient } from '../../models/patient.model';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './appointments.component.html'
})
export class AppointmentsComponent implements OnInit {
  appointments: Appointment[] = [];
  doctors: Doctor[] = [];
  patients: Patient[] = [];

  statusFilter = '';
  dateFilter = '';

  loading = true;
  saving = false;
  errorMessage = '';
  successMessage = '';

  // Modal / Form state
  showModal = false;
  isEditing = false;
  currentAppointmentId = 0;

  appointmentForm: AppointmentDto = {
    patientId: 0,
    doctorId: 0,
    appointmentDate: new Date().toISOString().split('T')[0],
    appointmentTime: '10:00 AM',
    status: 'Confirmed',
    reason: '',
    notes: ''
  };

  statuses = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];
  timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM',
    '04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM'
  ];

  constructor(
    private appointmentService: AppointmentService,
    private doctorService: DoctorService,
    private patientService: PatientService
  ) {}

  ngOnInit(): void {
    this.loadDropdownData();
    this.loadAppointments();
  }

  loadDropdownData(): void {
    this.doctorService.getDoctors().subscribe({
      next: (data) => this.doctors = data,
      error: (err) => console.error('Failed to load doctors for dropdown', err)
    });

    this.patientService.getPatients().subscribe({
      next: (data) => this.patients = data,
      error: (err) => console.error('Failed to load patients for dropdown', err)
    });
  }

  loadAppointments(): void {
    this.loading = true;
    this.errorMessage = '';

    this.appointmentService.getAppointments(this.statusFilter, this.dateFilter).subscribe({
      next: (data) => {
        this.appointments = data;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = 'Failed to load appointments list.';
        console.error(err);
      }
    });
  }

  onFilterChange(): void {
    this.loadAppointments();
  }

  clearFilters(): void {
    this.statusFilter = '';
    this.dateFilter = '';
    this.loadAppointments();
  }

  openAddModal(): void {
    this.isEditing = false;
    this.currentAppointmentId = 0;
    this.appointmentForm = {
      patientId: this.patients.length > 0 ? this.patients[0].id : 0,
      doctorId: this.doctors.length > 0 ? this.doctors[0].id : 0,
      appointmentDate: new Date().toISOString().split('T')[0],
      appointmentTime: '10:00 AM',
      status: 'Confirmed',
      reason: '',
      notes: ''
    };
    this.errorMessage = '';
    this.showModal = true;
  }

  openEditModal(appointment: Appointment): void {
    this.isEditing = true;
    this.currentAppointmentId = appointment.id;
    this.appointmentForm = {
      patientId: appointment.patientId,
      doctorId: appointment.doctorId,
      appointmentDate: appointment.appointmentDate ? appointment.appointmentDate.split('T')[0] : '',
      appointmentTime: appointment.appointmentTime,
      status: appointment.status,
      reason: appointment.reason,
      notes: appointment.notes
    };
    this.errorMessage = '';
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  saveAppointment(): void {
    if (!this.appointmentForm.patientId || !this.appointmentForm.doctorId || !this.appointmentForm.appointmentDate) {
      this.errorMessage = 'Please select a patient, doctor, and date.';
      return;
    }

    this.saving = true;
    this.errorMessage = '';
    this.successMessage = '';

    if (this.isEditing) {
      this.appointmentService.updateAppointment(this.currentAppointmentId, this.appointmentForm).subscribe({
        next: () => {
          this.saving = false;
          this.showModal = false;
          this.successMessage = 'Appointment updated successfully!';
          this.loadAppointments();
          this.clearSuccessAfterTimeout();
        },
        error: (err) => {
          this.saving = false;
          this.errorMessage = err.error?.message || 'Failed to update appointment.';
        }
      });
    } else {
      this.appointmentService.createAppointment(this.appointmentForm).subscribe({
        next: () => {
          this.saving = false;
          this.showModal = false;
          this.successMessage = 'Appointment booked successfully!';
          this.loadAppointments();
          this.clearSuccessAfterTimeout();
        },
        error: (err) => {
          this.saving = false;
          this.errorMessage = err.error?.message || 'Failed to book appointment.';
        }
      });
    }
  }

  updateAppointmentStatus(id: number, newStatus: string): void {
    this.appointmentService.updateStatus(id, newStatus).subscribe({
      next: () => {
        this.successMessage = `Appointment status updated to ${newStatus}!`;
        this.loadAppointments();
        this.clearSuccessAfterTimeout();
      },
      error: (err) => {
        alert(err.error?.message || 'Failed to update status.');
      }
    });
  }

  deleteAppointment(appointment: Appointment): void {
    if (confirm(`Are you sure you want to delete appointment #${appointment.id}?`)) {
      this.appointmentService.deleteAppointment(appointment.id).subscribe({
        next: () => {
          this.successMessage = 'Appointment deleted successfully!';
          this.loadAppointments();
          this.clearSuccessAfterTimeout();
        },
        error: (err) => {
          alert(err.error?.message || 'Failed to delete appointment.');
        }
      });
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'confirmed': return 'badge bg-success';
      case 'pending': return 'badge bg-warning text-dark';
      case 'completed': return 'badge bg-primary';
      case 'cancelled': return 'badge bg-danger';
      default: return 'badge bg-secondary';
    }
  }

  private clearSuccessAfterTimeout(): void {
    setTimeout(() => {
      this.successMessage = '';
    }, 3000);
  }
}
