import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PatientService } from '../../services/patient.service';
import { Patient, PatientDto } from '../../models/patient.model';

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './patients.component.html'
})
export class PatientsComponent implements OnInit {
  patients: Patient[] = [];
  searchTerm = '';
  loading = true;
  saving = false;
  errorMessage = '';
  successMessage = '';

  // Modal / Form state
  showModal = false;
  isEditing = false;
  currentPatientId = 0;

  patientForm: PatientDto = {
    name: '',
    age: 25,
    gender: 'Male',
    phone: '',
    email: '',
    address: '',
    bloodGroup: 'O+',
    medicalHistory: ''
  };

  bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  genders = ['Male', 'Female', 'Other'];

  constructor(private patientService: PatientService) {}

  ngOnInit(): void {
    this.loadPatients();
  }

  loadPatients(): void {
    this.loading = true;
    this.errorMessage = '';

    this.patientService.getPatients(this.searchTerm).subscribe({
      next: (data) => {
        this.patients = data;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = 'Failed to load patients list.';
        console.error(err);
      }
    });
  }

  onSearch(): void {
    this.loadPatients();
  }

  openAddModal(): void {
    this.isEditing = false;
    this.currentPatientId = 0;
    this.patientForm = {
      name: '',
      age: 25,
      gender: 'Male',
      phone: '',
      email: '',
      address: '',
      bloodGroup: 'O+',
      medicalHistory: ''
    };
    this.errorMessage = '';
    this.showModal = true;
  }

  openEditModal(patient: Patient): void {
    this.isEditing = true;
    this.currentPatientId = patient.id;
    this.patientForm = {
      name: patient.name,
      age: patient.age,
      gender: patient.gender,
      phone: patient.phone,
      email: patient.email,
      address: patient.address,
      bloodGroup: patient.bloodGroup,
      medicalHistory: patient.medicalHistory
    };
    this.errorMessage = '';
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  savePatient(): void {
    if (!this.patientForm.name || !this.patientForm.phone) {
      this.errorMessage = 'Patient Name and Phone number are required.';
      return;
    }

    this.saving = true;
    this.errorMessage = '';
    this.successMessage = '';

    if (this.isEditing) {
      this.patientService.updatePatient(this.currentPatientId, this.patientForm).subscribe({
        next: () => {
          this.saving = false;
          this.showModal = false;
          this.successMessage = 'Patient record updated successfully!';
          this.loadPatients();
          this.clearSuccessAfterTimeout();
        },
        error: (err) => {
          this.saving = false;
          this.errorMessage = err.error?.message || 'Failed to update patient.';
        }
      });
    } else {
      this.patientService.createPatient(this.patientForm).subscribe({
        next: () => {
          this.saving = false;
          this.showModal = false;
          this.successMessage = 'Patient registered successfully!';
          this.loadPatients();
          this.clearSuccessAfterTimeout();
        },
        error: (err) => {
          this.saving = false;
          this.errorMessage = err.error?.message || 'Failed to register patient.';
        }
      });
    }
  }

  deletePatient(patient: Patient): void {
    if (confirm(`Are you sure you want to delete patient "${patient.name}"?`)) {
      this.patientService.deletePatient(patient.id).subscribe({
        next: () => {
          this.successMessage = 'Patient record deleted successfully!';
          this.loadPatients();
          this.clearSuccessAfterTimeout();
        },
        error: (err) => {
          alert(err.error?.message || 'Failed to delete patient record.');
        }
      });
    }
  }

  getBloodGroupBadgeClass(bg: string): string {
    switch (bg?.toUpperCase()) {
      case 'O+':
      case 'O-': return 'badge bg-danger-subtle text-danger-emphasis';
      case 'A+':
      case 'A-': return 'badge bg-primary-subtle text-primary-emphasis';
      case 'B+':
      case 'B-': return 'badge bg-success-subtle text-success-emphasis';
      default: return 'badge bg-warning-subtle text-warning-emphasis';
    }
  }

  private clearSuccessAfterTimeout(): void {
    setTimeout(() => {
      this.successMessage = '';
    }, 3000);
  }
}
