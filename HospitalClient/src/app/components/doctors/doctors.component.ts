import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DoctorService } from '../../services/doctor.service';
import { Doctor, DoctorDto } from '../../models/doctor.model';

@Component({
  selector: 'app-doctors',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './doctors.component.html'
})
export class DoctorsComponent implements OnInit {
  doctors: Doctor[] = [];
  searchTerm = '';
  loading = true;
  saving = false;
  errorMessage = '';
  successMessage = '';

  // Modal / Form state
  showModal = false;
  isEditing = false;
  currentDoctorId = 0;

  doctorForm: DoctorDto = {
    name: '',
    specialization: '',
    department: '',
    email: '',
    phone: '',
    experienceYears: 1,
    consultationFee: 500,
    availableDays: 'Mon-Fri'
  };

  departments = [
    'Cardiology',
    'Neurology',
    'Orthopedics',
    'Pediatrics',
    'Dermatology',
    'General Medicine',
    'Gynecology',
    'Oncology',
    'ENT'
  ];

  constructor(private doctorService: DoctorService) {}

  ngOnInit(): void {
    this.loadDoctors();
  }

  loadDoctors(): void {
    this.loading = true;
    this.errorMessage = '';

    this.doctorService.getDoctors(this.searchTerm).subscribe({
      next: (data) => {
        this.doctors = data;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = 'Failed to load doctors list.';
        console.error(err);
      }
    });
  }

  onSearch(): void {
    this.loadDoctors();
  }

  openAddModal(): void {
    this.isEditing = false;
    this.currentDoctorId = 0;
    this.doctorForm = {
      name: '',
      specialization: '',
      department: this.departments[0],
      email: '',
      phone: '',
      experienceYears: 1,
      consultationFee: 500,
      availableDays: 'Mon-Fri'
    };
    this.errorMessage = '';
    this.showModal = true;
  }

  openEditModal(doctor: Doctor): void {
    this.isEditing = true;
    this.currentDoctorId = doctor.id;
    this.doctorForm = {
      name: doctor.name,
      specialization: doctor.specialization,
      department: doctor.department,
      email: doctor.email,
      phone: doctor.phone,
      experienceYears: doctor.experienceYears,
      consultationFee: doctor.consultationFee,
      availableDays: doctor.availableDays
    };
    this.errorMessage = '';
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  saveDoctor(): void {
    if (!this.doctorForm.name || !this.doctorForm.email || !this.doctorForm.phone) {
      this.errorMessage = 'Please fill all required fields.';
      return;
    }

    this.saving = true;
    this.errorMessage = '';
    this.successMessage = '';

    if (this.isEditing) {
      this.doctorService.updateDoctor(this.currentDoctorId, this.doctorForm).subscribe({
        next: () => {
          this.saving = false;
          this.showModal = false;
          this.successMessage = 'Doctor updated successfully!';
          this.loadDoctors();
          this.clearSuccessAfterTimeout();
        },
        error: (err) => {
          this.saving = false;
          this.errorMessage = err.error?.message || 'Failed to update doctor.';
        }
      });
    } else {
      this.doctorService.createDoctor(this.doctorForm).subscribe({
        next: () => {
          this.saving = false;
          this.showModal = false;
          this.successMessage = 'Doctor added successfully!';
          this.loadDoctors();
          this.clearSuccessAfterTimeout();
        },
        error: (err) => {
          this.saving = false;
          this.errorMessage = err.error?.message || 'Failed to add doctor.';
        }
      });
    }
  }

  deleteDoctor(doctor: Doctor): void {
    if (confirm(`Are you sure you want to delete Dr. ${doctor.name}?`)) {
      this.doctorService.deleteDoctor(doctor.id).subscribe({
        next: () => {
          this.successMessage = 'Doctor deleted successfully!';
          this.loadDoctors();
          this.clearSuccessAfterTimeout();
        },
        error: (err) => {
          alert(err.error?.message || 'Failed to delete doctor.');
        }
      });
    }
  }

  private clearSuccessAfterTimeout(): void {
    setTimeout(() => {
      this.successMessage = '';
    }, 3000);
  }
}
