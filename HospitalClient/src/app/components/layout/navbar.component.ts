import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark px-3 shadow-sm border-bottom border-secondary">
      <div class="container-fluid">
        <!-- Brand / Toggle -->
        <a class="navbar-brand fw-bold d-flex align-items-center gap-2" routerLink="/dashboard">
          <span class="p-1 bg-primary rounded text-white d-inline-flex align-items-center justify-content-center" style="width: 32px; height: 32px;">
            <i class="bi bi-hospital-fill"></i>
          </span>
          <span>MedCare <span class="text-primary">HMS</span></span>
        </a>

        <!-- User Info & Logout Button -->
        <div class="d-flex align-items-center gap-3 ms-auto">
          <div class="text-end d-none d-sm-block">
            <div class="fw-semibold text-white small">{{ authService.currentUser()?.fullName || 'Hospital Staff' }}</div>
            <span class="badge bg-primary-subtle text-primary border border-primary-subtle" style="font-size: 0.7rem;">
              {{ authService.currentUser()?.role || 'Admin' }}
            </span>
          </div>

          <button class="btn btn-outline-danger btn-sm px-3 d-flex align-items-center gap-1" (click)="logout()" title="Sign Out">
            <i class="bi bi-box-arrow-right"></i>
            <span class="d-none d-sm-inline">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  `
})
export class NavbarComponent {
  constructor(public authService: AuthService) {}

  logout(): void {
    if (confirm('Are you sure you want to sign out?')) {
      this.authService.logout();
    }
  }
}
