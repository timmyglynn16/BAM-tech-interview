import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { DutiesService, AstronautDutyWithPerson, CreateDutyRequest } from '../../services/duties.service';
import { CreateDutyDialogComponent } from './create-duty-dialog.component';

interface DutyWithPerson {
  id: number;
  personId: number;
  personName: string;
  rank: string;
  dutyTitle: string;
  dutyStartDate: string;
  dutyEndDate?: string | null;
  isActive: boolean;
  isCompleted: boolean;
}

@Component({
  selector: 'app-duties',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatTableModule, MatCardModule, MatButtonModule,
    MatIconModule, MatChipsModule, MatInputModule, MatFormFieldModule, MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  template: `
    <div class="header">
      <h1>Duty Management</h1>
      <button mat-raised-button color="primary" (click)="openCreateDutyDialog()">
        <mat-icon>add</mat-icon>
        Assign Duty
      </button>
    </div>

    <div class="grid grid-2 mb-20">
      <div class="card stat-card">
        <div class="stat">
          <mat-icon>assignment</mat-icon>
          <div>
            <h2>{{ duties.length }}</h2>
            <p>Total Duties</p>
          </div>
        </div>
      </div>
      
      <div class="card stat-card">
        <div class="stat">
          <mat-icon>check_circle</mat-icon>
          <div>
            <h2>{{ getCompletedCount() }}</h2>
            <p>Completed</p>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <mat-form-field appearance="outline" class="search-field">
        <mat-label>Search duties</mat-label>
        <input matInput placeholder="Duty title or person name" [(ngModel)]="searchTerm" (input)="filterDuties()">
        <mat-icon matSuffix>search</mat-icon>
      </mat-form-field>

      <div *ngIf="loading" class="loading-container">
        <mat-spinner></mat-spinner>
        <p>Loading duties...</p>
      </div>

      <div *ngIf="error" class="error-container">
        <mat-icon color="warn">error</mat-icon>
        <p>{{ error }}</p>
        <button mat-button (click)="loadDuties()">Retry</button>
      </div>

      <table mat-table [dataSource]="filteredDuties" class="duties-table" *ngIf="!loading && !error">
        <ng-container matColumnDef="dutyTitle">
          <th mat-header-cell *matHeaderCellDef>Duty Title</th>
          <td mat-cell *matCellDef="let duty">
            <div class="duty-info">
              <div class="duty-title">{{ duty.dutyTitle }}</div>
            </div>
          </td>
        </ng-container>

        <ng-container matColumnDef="personName">
          <th mat-header-cell *matHeaderCellDef>Assigned To</th>
          <td mat-cell *matCellDef="let duty">
            <div class="assignee">
              <mat-icon>person</mat-icon>
              <span>{{ duty.personName }}</span>
            </div>
          </td>
        </ng-container>

        <ng-container matColumnDef="rank">
          <th mat-header-cell *matHeaderCellDef>Rank</th>
          <td mat-cell *matCellDef="let duty">
            <mat-chip color="primary" selected>
              {{ duty.rank }}
            </mat-chip>
          </td>
        </ng-container>

        <ng-container matColumnDef="dutyStartDate">
          <th mat-header-cell *matHeaderCellDef>Start Date</th>
          <td mat-cell *matCellDef="let duty">
            <div class="date-info">
              <mat-icon>play_arrow</mat-icon>
              <span>{{ duty.dutyStartDate | date:'MMM dd, yyyy' }}</span>
            </div>
          </td>
        </ng-container>

        <ng-container matColumnDef="dutyEndDate">
          <th mat-header-cell *matHeaderCellDef>End Date</th>
          <td mat-cell *matCellDef="let duty">
            <div class="date-info" [class.overdue]="isOverdue(duty.dutyEndDate)">
              <mat-icon>stop</mat-icon>
              <span>{{ duty.dutyEndDate | date:'MMM dd, yyyy' }}</span>
            </div>
          </td>
        </ng-container>

        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>Actions</th>
          <td mat-cell *matCellDef="let duty">
            <button mat-icon-button>
              <mat-icon>edit</mat-icon>
            </button>
            <button mat-icon-button>
              <mat-icon>delete</mat-icon>
            </button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns" class="header-row"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="data-row" [class.overdue-row]="isOverdue(row.dutyEndDate)"></tr>
      </table>
    </div>
  `,
  styles: [`
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    
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
    
    .search-field {
      width: 100%;
      margin-bottom: 20px;
    }
    
    .duties-table {
      width: 100%;
    }
    
    .header-row {
      background-color: #f5f5f5;
    }
    
    .data-row {
      height: 80px;
    }
    
    .data-row:hover {
      background-color: #f8f9fa;
    }
    
    .duty-info {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 8px 0;
    }
    
    .duty-title {
      font-weight: 500;
      font-size: 1rem;
      line-height: 1.3;
    }
    
    .date-info {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #666;
      font-size: 0.9rem;
    }
    
    .assignee {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 0;
    }
    
    .assignee span {
      font-weight: 500;
    }
    
    .date-info.overdue {
      color: #d32f2f;
    }
    
    .overdue-row {
      background-color: #ffebee;
    }
    
    .overdue-row:hover {
      background-color: #ffcdd2;
    }
    
    .loading-container, .error-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      padding: 40px;
      text-align: center;
    }
    
    .error-container {
      color: #d32f2f;
    }
    
    @media (max-width: 768px) {
      .header {
        flex-direction: column;
        gap: 15px;
        align-items: stretch;
      }
    }
  `]
})
export class DutiesComponent implements OnInit {
  displayedColumns: string[] = ['dutyTitle', 'personName', 'rank', 'dutyStartDate', 'dutyEndDate', 'actions'];
  
  duties: DutyWithPerson[] = [];
  filteredDuties: DutyWithPerson[] = [];
  loading = false;
  error: string | null = null;
  searchTerm = '';

  constructor(
    private dutiesService: DutiesService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadDuties();
  }

  loadDuties() {
    this.loading = true;
    this.error = null;
    
    this.dutiesService.getAllDuties().subscribe({
      next: (response) => {
        console.log('All duties response:', response);
        this.loading = false;
        
        if (response.success && response.astronautDuties) {
          const now = new Date();
          this.duties = response.astronautDuties.map((duty: AstronautDutyWithPerson) => {
            const endDate = duty.dutyEndDate ? new Date(duty.dutyEndDate) : null;
            const isCompleted = endDate ? endDate < now : false;
            const isActive = !endDate || endDate >= now;

            return {
              id: duty.id,
              personId: duty.personId,
              personName: duty.personName,
              rank: duty.rank,
              dutyTitle: duty.dutyTitle,
              dutyStartDate: duty.dutyStartDate,
              dutyEndDate: duty.dutyEndDate,
              isActive,
              isCompleted
            };
          });
          
          this.filteredDuties = [...this.duties];
        } else {
          this.error = response.message || 'Failed to load duties';
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Failed to load duties. Please check if the API is running.';
        console.error('Error loading duties:', err);
      }
    });
  }

  filterDuties() {
    if (!this.searchTerm.trim()) {
      this.filteredDuties = [...this.duties];
    } else {
      this.filteredDuties = this.duties.filter(duty =>
        duty.dutyTitle.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        duty.personName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        duty.rank.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  getCompletedCount(): number {
    return this.duties.filter(duty => duty.isCompleted).length;
  }

  isOverdue(endDate?: string | null): boolean {
    if (!endDate) return false;
    return new Date(endDate) < new Date();
  }

  // Create Duty Dialog Methods
  openCreateDutyDialog() {
    const dialogRef = this.dialog.open(CreateDutyDialogComponent, {
      width: '500px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.name) {
        this.createDuty(result);
      }
    });
  }

  createDuty(dutyData: any) {
    const request: CreateDutyRequest = {
      name: dutyData.name,
      rank: dutyData.rank,
      dutyTitle: dutyData.dutyTitle,
      dutyStartDate: dutyData.dutyStartDate
    };

    this.dutiesService.createDuty(request).subscribe({
      next: (response) => {
        if (response.success) {
          this.snackBar.open('Duty assigned successfully!', 'Close', { duration: 3000 });
          this.loadDuties(); // Refresh the list
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