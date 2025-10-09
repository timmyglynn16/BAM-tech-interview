import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { PersonsService, CreatePersonRequest, Person } from '../../services/persons.service';
import { AstronautsService, PersonAstronaut } from '../../services/astronauts.service';
import { DutiesService, AstronautDutyWithPerson } from '../../services/duties.service';
import { CreatePersonDialogComponent } from '../persons/create-person-dialog.component';
import { CreateDutyDialogComponent } from '../duties/create-duty-dialog.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, MatChipsModule, MatSnackBarModule, MatProgressSpinnerModule],
  template: `
    <h1>Mission Control Dashboard</h1>
    
    <div *ngIf="loading" class="loading-container">
      <mat-spinner></mat-spinner>
      <p>Loading dashboard data...</p>
    </div>

    <div *ngIf="!loading">
      <div class="grid grid-4 mb-20">
        <div class="card stat-card">
          <div class="stat">
            <mat-icon>person</mat-icon>
            <div>
              <h2>{{ totalPersons }}</h2>
              <p>Total Persons</p>
            </div>
          </div>
        </div>
        
        <div class="card stat-card">
          <div class="stat">
            <mat-icon>assignment</mat-icon>
            <div>
              <h2>{{ totalAstronauts }}</h2>
              <p>Astronauts</p>
            </div>
          </div>
        </div>
        
        <div class="card stat-card">
          <div class="stat">
            <mat-icon>schedule</mat-icon>
            <div>
              <h2>{{ activeDuties }}</h2>
              <p>Active Duties</p>
            </div>
          </div>
        </div>

        <div class="card stat-card">
          <div class="stat">
            <mat-icon>check_circle</mat-icon>
            <div>
              <h2>{{ completedDuties }}</h2>
              <p>Completed Duties</p>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-2">
        <div class="card">
          <h3>Recent Activities</h3>
          <div *ngIf="recentActivities.length === 0" class="no-activity">
            <mat-icon>history</mat-icon>
            <p>No recent activity</p>
          </div>
          <div class="activity" *ngFor="let activity of recentActivities">
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
            <button mat-raised-button color="primary" *ngFor="let action of actions" (click)="handleAction(action)">
              <mat-icon>{{ action.icon }}</mat-icon>
              {{ action.label }}
            </button>
          </div>
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

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      padding: 40px;
      text-align: center;
    }

    .no-activity {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      padding: 20px;
      color: #666;
      text-align: center;
    }

    .no-activity mat-icon {
      font-size: 2rem;
      width: 2rem;
      height: 2rem;
      opacity: 0.5;
    }
  `]
})
export class DashboardComponent implements OnInit {
  loading = true;
  totalPersons = 0;
  totalAstronauts = 0;
  activeDuties = 0;
  completedDuties = 0;
  recentActivities: any[] = [];

  actions = [
    { icon: 'add', label: 'Add Person', action: 'addPerson' },
    { icon: 'assignment', label: 'Assign Duty', action: 'assignDuty' },
    { icon: 'person_search', label: 'View Persons', action: 'viewPersons' },
    { icon: 'assignment_ind', label: 'View Astronauts', action: 'viewAstronauts' },
    { icon: 'list_alt', label: 'View Duties', action: 'viewDuties' }
  ];

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
    private personsService: PersonsService,
    private astronautsService: AstronautsService,
    private dutiesService: DutiesService
  ) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.loading = true;
    
    // Load all data in parallel
    Promise.all([
      this.personsService.getAllPersons().toPromise(),
      this.astronautsService.getAllAstronauts().toPromise(),
      this.dutiesService.getAllDuties().toPromise()
    ]).then(([personsResponse, astronautsResponse, dutiesResponse]) => {
      // Process persons data
      if (personsResponse?.success) {
        this.totalPersons = (personsResponse.people as Person[])?.length || 0;
      }

      // Process astronauts data
      if (astronautsResponse?.success) {
        this.totalAstronauts = (astronautsResponse.astronauts as PersonAstronaut[])?.length || 0;
      }

      // Process duties data
      if (dutiesResponse?.success) {
        const duties = (dutiesResponse.astronautDuties as AstronautDutyWithPerson[]) || [];
        const now = new Date();
        
        this.activeDuties = duties.filter(duty => !duty.dutyEndDate).length;
        this.completedDuties = duties.filter(duty => {
          if (!duty.dutyEndDate) return false;
          return new Date(duty.dutyEndDate) < now;
        }).length;

        // Generate recent activities from duties and persons
        this.generateRecentActivities(duties, personsResponse?.people as Person[]);
      }

      this.loading = false;
    }).catch(error => {
      console.error('Error loading dashboard data:', error);
      this.loading = false;
    });
  }

  generateRecentActivities(duties: AstronautDutyWithPerson[], persons: Person[] = []) {
    const activities: any[] = [];
    
    // Create duty activities
    const recentDuties = duties
      .sort((a, b) => b.id - a.id)
      .slice(0, 5);

    recentDuties.forEach(duty => {
      const isRetirement = duty.dutyTitle === 'RETIRED';
      const isActive = !duty.dutyEndDate;
      
      activities.push({
        icon: 'assignment', // Use the duties sidebar icon
        title: isRetirement 
          ? `${duty.personName} retired (${duty.rank})`
          : isActive 
            ? `${duty.personName} assigned to ${duty.dutyTitle} (${duty.rank})`
            : `${duty.personName} completed ${duty.dutyTitle} (${duty.rank})`,
        time: this.getRelativeTime(duty.dutyStartDate),
        type: 'duty'
      });
    });

    // Create person activities (since we don't have creation timestamps, we'll show recent persons)
    // Note: This is a simplified approach since we don't have person creation dates
    const recentPersons = persons
      .sort((a, b) => b.personId - a.personId) // Sort by ID descending (most recent first)
      .slice(0, 3); // Show fewer person activities

    recentPersons.forEach(person => {
      activities.push({
        icon: 'group', // Use the persons sidebar icon
        title: `${person.name} added to system`,
        time: 'Recently', // Since we don't have creation timestamps
        type: 'person'
      });
    });

    // Sort all activities by type (duties first, then persons) and limit to 5 total
    this.recentActivities = activities
      .sort((a, b) => {
        if (a.type === 'duty' && b.type === 'person') return -1;
        if (a.type === 'person' && b.type === 'duty') return 1;
        return 0;
      })
      .slice(0, 5);
  }

  getRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) {
      return 'Just now';
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  }

  handleAction(action: any) {
    switch (action.action) {
      case 'addPerson':
        this.openCreatePersonDialog();
        break;
      case 'assignDuty':
        this.openCreateDutyDialog();
        break;
      case 'viewPersons':
        this.router.navigate(['/persons']);
        break;
      case 'viewAstronauts':
        this.router.navigate(['/astronauts']);
        break;
      case 'viewDuties':
        this.router.navigate(['/duties']);
        break;
      default:
        console.log('Unknown action:', action.action);
    }
  }

  openCreatePersonDialog() {
    const dialogRef = this.dialog.open(CreatePersonDialogComponent, {
      width: '500px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.name) {
        this.createPerson(result.name);
      }
    });
  }

  openCreateDutyDialog() {
    const dialogRef = this.dialog.open(CreateDutyDialogComponent, {
      width: '600px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.createDuty(result);
      }
    });
  }

  createPerson(name: string) {
    const request: CreatePersonRequest = {
      name: name,
      role: 0 // Default to Personnel
    };

    this.personsService.createPerson(request).subscribe({
      next: (response) => {
        if (response.success) {
          this.snackBar.open('Person created successfully!', 'Close', { duration: 3000 });
          this.loadDashboardData(); // Refresh dashboard data
        } else {
          this.snackBar.open(response.message || 'Failed to create person', 'Close', { duration: 3000 });
        }
      },
      error: (err) => {
        this.snackBar.open('Error creating person: ' + err.message, 'Close', { duration: 3000 });
        console.error('Error creating person:', err);
      }
    });
  }

  createDuty(dutyData: any) {
    this.dutiesService.createDuty(dutyData).subscribe({
      next: (response) => {
        if (response.success) {
          this.snackBar.open('Duty assigned successfully!', 'Close', { duration: 3000 });
          this.loadDashboardData(); // Refresh dashboard data
        } else {
          this.snackBar.open(response.message || 'Failed to assign duty', 'Close', { duration: 3000 });
        }
      },
      error: (err) => {
        this.snackBar.open('Error assigning duty: ' + err.message, 'Close', { duration: 3000 });
        console.error('Error assigning duty:', err);
      }
    });
  }
}
