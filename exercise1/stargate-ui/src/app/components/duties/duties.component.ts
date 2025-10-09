import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-duties',
  standalone: true,
  imports: [
    CommonModule, MatTableModule, MatCardModule, MatButtonModule, 
    MatIconModule, MatChipsModule, MatInputModule, MatFormFieldModule, MatSelectModule
  ],
  template: `
    <div class="header">
      <h1>Duty Management</h1>
      <button mat-raised-button color="primary">
        <mat-icon>add</mat-icon>
        Assign Duty
      </button>
    </div>

    <div class="grid grid-4 mb-20">
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
          <mat-icon>schedule</mat-icon>
          <div>
            <h2>{{ getPendingCount() }}</h2>
            <p>Pending</p>
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
      
      <div class="card stat-card">
        <div class="stat">
          <mat-icon>warning</mat-icon>
          <div>
            <h2>{{ getOverdueCount() }}</h2>
            <p>Overdue</p>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="filters">
        <mat-form-field appearance="outline" class="filter-field">
          <mat-label>Search duties</mat-label>
          <input matInput placeholder="Duty title or description">
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>
        
        <mat-form-field appearance="outline" class="filter-field">
          <mat-label>Status</mat-label>
          <mat-select>
            <mat-option value="">All Statuses</mat-option>
            <mat-option value="pending">Pending</mat-option>
            <mat-option value="progress">In Progress</mat-option>
            <mat-option value="completed">Completed</mat-option>
            <mat-option value="overdue">Overdue</mat-option>
          </mat-select>
        </mat-form-field>
        
        <mat-form-field appearance="outline" class="filter-field">
          <mat-label>Priority</mat-label>
          <mat-select>
            <mat-option value="">All Priorities</mat-option>
            <mat-option value="critical">Critical</mat-option>
            <mat-option value="high">High</mat-option>
            <mat-option value="medium">Medium</mat-option>
            <mat-option value="low">Low</mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      <table mat-table [dataSource]="duties" class="duties-table">
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
              <mat-icon>more_vert</mat-icon>
            </button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns" class="header-row"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;" 
            [class.overdue-row]="isOverdue(row.dutyEndDate)" class="data-row"></tr>
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
    
    .filters {
      display: flex;
      gap: 16px;
      margin-bottom: 20px;
      flex-wrap: wrap;
    }
    
    .filter-field {
      flex: 1;
      min-width: 200px;
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
    
    @media (max-width: 768px) {
      .header {
        flex-direction: column;
        gap: 15px;
        align-items: stretch;
      }
      
      .filters {
        flex-direction: column;
      }
      
      .filter-field {
        min-width: unset;
      }
    }
  `]
})
export class DutiesComponent {
  displayedColumns: string[] = ['dutyTitle', 'personName', 'rank', 'dutyStartDate', 'dutyEndDate', 'actions'];
  
  duties = [
    {
      id: 1,
      personId: 1,
      personName: 'Commander Sarah Chen',
      rank: 'Commander',
      dutyTitle: 'Navigation System Calibration',
      dutyStartDate: new Date('2024-02-01'),
      dutyEndDate: new Date('2024-02-15')
    },
    {
      id: 2,
      personId: 2,
      personName: 'Lt. Marcus Rodriguez',
      rank: 'Lieutenant',
      dutyTitle: 'Life Support System Check',
      dutyStartDate: new Date('2024-02-05'),
      dutyEndDate: new Date('2024-02-10')
    },
    {
      id: 3,
      personId: 3,
      personName: 'Dr. Elena Volkov',
      rank: 'Doctor',
      dutyTitle: 'Medical Equipment Inventory',
      dutyStartDate: new Date('2024-01-30'),
      dutyEndDate: new Date('2024-02-05')
    },
    {
      id: 4,
      personId: 5,
      personName: 'Lt. Commander Aisha Patel',
      rank: 'Lt. Commander',
      dutyTitle: 'Communication Protocol Review',
      dutyStartDate: new Date('2024-01-15'),
      dutyEndDate: new Date('2024-01-30')
    },
    {
      id: 5,
      personId: 4,
      personName: 'Captain James Mitchell',
      rank: 'Captain',
      dutyTitle: 'Fuel System Inspection',
      dutyStartDate: new Date('2024-02-10'),
      dutyEndDate: new Date('2024-02-20')
    }
  ];

  getPendingCount(): number {
    return this.duties.filter(duty => duty.dutyEndDate && duty.dutyEndDate > new Date()).length;
  }

  getCompletedCount(): number {
    return this.duties.filter(duty => duty.dutyEndDate && duty.dutyEndDate <= new Date()).length;
  }

  getOverdueCount(): number {
    return this.duties.filter(duty => this.isOverdue(duty.dutyEndDate)).length;
  }

  isOverdue(endDate: Date): boolean {
    return endDate < new Date();
  }
}
