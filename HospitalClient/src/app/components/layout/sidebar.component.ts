import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="sidebar bg-dark text-white d-flex flex-column h-100 p-3 shadow">
      <!-- Section Title -->
      <div class="text-uppercase text-secondary fw-bold mb-3 px-2" style="font-size: 0.75rem; letter-spacing: 1px;">
        Main Navigation
      </div>

      <!-- Navigation Links -->
      <ul class="nav nav-pills flex-column gap-1 mb-auto">
        <li class="nav-item">
          <a routerLink="/dashboard" routerLinkActive="active" class="nav-link text-white-50 d-flex align-items-center gap-3 px-3 py-2 rounded-3">
            <i class="bi bi-grid-1x2-fill fs-5"></i>
            <span class="fw-medium">Dashboard</span>
          </a>
        </li>

        <li class="nav-item">
          <a routerLink="/doctors" routerLinkActive="active" class="nav-link text-white-50 d-flex align-items-center gap-3 px-3 py-2 rounded-3">
            <i class="bi bi-person-badge-fill fs-5"></i>
            <span class="fw-medium">Doctors</span>
          </a>
        </li>

        <li class="nav-item">
          <a routerLink="/patients" routerLinkActive="active" class="nav-link text-white-50 d-flex align-items-center gap-3 px-3 py-2 rounded-3">
            <i class="bi bi-people-fill fs-5"></i>
            <span class="fw-medium">Patients</span>
          </a>
        </li>

        <li class="nav-item">
          <a routerLink="/appointments" routerLinkActive="active" class="nav-link text-white-50 d-flex align-items-center gap-3 px-3 py-2 rounded-3">
            <i class="bi bi-calendar2-check-fill fs-5"></i>
            <span class="fw-medium">Appointments</span>
          </a>
        </li>
      </ul>

      <!-- Footer Info in Sidebar -->
      <div class="border-top border-secondary pt-3 mt-4 text-center text-secondary small">
        <div><i class="bi bi-shield-lock-fill text-success me-1"></i>Secure HMS v1.0</div>
      </div>
    </div>
  `,
  styles: [`
    .sidebar {
      width: 250px;
      min-height: calc(100vh - 56px);
      background-color: #1e293b !important;
    }
    .nav-link {
      transition: all 0.2s ease;
    }
    .nav-link:hover {
      background-color: rgba(255, 255, 255, 0.08);
      color: #ffffff !important;
    }
    .nav-link.active {
      background-color: #0284c7 !important;
      color: #ffffff !important;
      font-weight: 600;
      box-shadow: 0 4px 6px -1px rgba(2, 132, 199, 0.3);
    }
    @media (max-width: 768px) {
      .sidebar {
        width: 100%;
        min-height: auto;
      }
    }
  `]
})
export class SidebarComponent {}
