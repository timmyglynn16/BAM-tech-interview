import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, MatChipsModule],
  template: `
    <h1>Mission Control Dashboard</h1>
    
    <div class="grid grid-4 mb-20">
      <div class="card stat-card">
        <div class="stat">
          <mat-icon>person</mat-icon>
          <div>
            <h2>8</h2>
            <p>Total Persons</p>
          </div>
        </div>
      </div>
      
      
      <div class="card stat-card">
        <div class="stat">
          <mat-icon>assignment</mat-icon>
          <div>
            <h2>5</h2>
            <p>Astronauts</p>
          </div>
        </div>
      </div>
      
      <div class="card stat-card">
        <div class="stat">
          <mat-icon>schedule</mat-icon>
          <div>
            <h2>6</h2>
            <p>Active Duties</p>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-2">
      <div class="card">
        <h3>Recent Activities</h3>
        <div class="activity" *ngFor="let activity of activities">
          <mat-icon>{{ activity.icon }}</mat-icon>
          <div>
            <p>{{ activity.title }}</p>
            <small class="text-muted">{{ activity.time }}</small>
          </div>
        </div>
      </div>

      <div class="card">
        <h3>Quick Actions</h3>
        <div class="actions">
          <button mat-raised-button color="primary" *ngFor="let action of actions">
            <mat-icon>{{ action.icon }}</mat-icon>
            {{ action.label }}
          </button>
        </div>
      </div>
    </div>

  `,
  styles: [`
    .stat-card {
      background: linear-gradient(135deg, #1976d2, #42a5f5);
      color: white;
    }
    
    .stat {
      display: flex;
      align-items: center;
      gap: 15px;
    }
    
    .stat h2 {
      font-size: 2.5rem;
      margin: 0;
      font-weight: 300;
    }
    
    .stat p {
      margin: 0;
      opacity: 0.9;
    }
    
    .activity {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      border-radius: 6px;
      background: #f8f9fa;
      margin-bottom: 8px;
    }
    
    .activity p {
      margin: 0;
      font-weight: 500;
    }
    
    .actions {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }
    
    .actions button {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .missions {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    
    .mission {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      border: 1px solid #e0e0e0;
      border-radius: 6px;
      background: #fafafa;
    }
    
    .mission h4 {
      margin: 0 0 4px 0;
    }
    
    .mission p {
      margin: 0;
    }
  `]
})
export class DashboardComponent {
  activities = [
    { icon: 'person_add', title: 'New astronaut assigned to mission', time: '2 hours ago' },
    { icon: 'flight_land', title: 'Mission Alpha-7 completed', time: '4 hours ago' },
    { icon: 'warning', title: 'Maintenance required for Station Beta', time: '6 hours ago' }
  ];

  actions = [
    { icon: 'add', label: 'Add Person' },
    { icon: 'assignment', label: 'Assign Duty' },
    { icon: 'assessment', label: 'Generate Report' }
  ];

}
