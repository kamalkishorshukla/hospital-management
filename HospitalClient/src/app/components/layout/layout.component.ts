import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar.component';
import { SidebarComponent } from './sidebar.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, SidebarComponent],
  template: `
    <div class="d-flex flex-column min-vh-100">
      <!-- Top Navbar -->
      <app-navbar></app-navbar>

      <!-- Main Body Container: Sidebar + Content -->
      <div class="d-flex flex-grow-1 flex-column flex-md-row">
        <!-- Sidebar -->
        <app-sidebar></app-sidebar>

        <!-- Dynamic Content Area -->
        <main class="flex-grow-1 bg-light p-2 p-md-4 overflow-auto" style="min-height: calc(100vh - 56px);">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `
})
export class LayoutComponent {}
