import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-astronauts',
  standalone: true,
  imports: [
    CommonModule, MatTableModule, MatCardModule, MatButtonModule, 
    MatIconModule, MatChipsModule, MatInputModule, MatFormFieldModule
  ],
  template: `
    <div class="header">
      <h1>Astronaut Management</h1>
      <button mat-raised-button color="primary">
        <mat-icon>add</mat-icon>
        Add Astronaut
      </button>
    </div>

    <div class="card">
      <mat-form-field appearance="outline" class="search-field">
        <mat-label>Search astronauts</mat-label>
        <input matInput placeholder="Name, rank, or specialization">
        <mat-icon matSuffix>search</mat-icon>
      </mat-form-field>

      <table mat-table [dataSource]="astronauts" class="astronauts-table">
        <ng-container matColumnDef="personId">
          <th mat-header-cell *matHeaderCellDef>Person ID</th>
          <td mat-cell *matCellDef="let astronaut">
            <div class="person-id">
              {{ astronaut.personId }}
            </div>
          </td>
        </ng-container>

        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef>Name (Person)</th>
          <td mat-cell *matCellDef="let astronaut">
            <div class="astronaut-info">
              <mat-icon>person</mat-icon>
              <div>
                <div class="name">{{ astronaut.name }}</div>
                <div class="source">From Person table</div>
              </div>
            </div>
          </td>
        </ng-container>

        <ng-container matColumnDef="currentRank">
          <th mat-header-cell *matHeaderCellDef>Current Rank (AstronautDetail)</th>
          <td mat-cell *matCellDef="let astronaut">
            <mat-chip color="primary" selected>
              {{ astronaut.currentRank }}
            </mat-chip>
          </td>
        </ng-container>

        <ng-container matColumnDef="currentDutyTitle">
          <th mat-header-cell *matHeaderCellDef>Current Duty (AstronautDetail)</th>
          <td mat-cell *matCellDef="let astronaut">
            <div class="duty-title">
              {{ astronaut.currentDutyTitle }}
            </div>
          </td>
        </ng-container>

        <ng-container matColumnDef="careerStartDate">
          <th mat-header-cell *matHeaderCellDef>Career Start (AstronautDetail)</th>
          <td mat-cell *matCellDef="let astronaut">
            <div class="date-info">
              <mat-icon>calendar_today</mat-icon>
              {{ astronaut.careerStartDate | date:'MMM yyyy' }}
            </div>
          </td>
        </ng-container>

        <ng-container matColumnDef="careerEndDate">
          <th mat-header-cell *matHeaderCellDef>Career End (AstronautDetail)</th>
          <td mat-cell *matCellDef="let astronaut">
            <div class="date-info" *ngIf="astronaut.careerEndDate; else activeStatus">
              <mat-icon>event_busy</mat-icon>
              {{ astronaut.careerEndDate | date:'MMM yyyy' }}
            </div>
            <ng-template #activeStatus>
              <mat-chip color="accent" selected>Active</mat-chip>
            </ng-template>
          </td>
        </ng-container>

        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>Actions</th>
          <td mat-cell *matCellDef="let astronaut">
            <button mat-icon-button>
              <mat-icon>more_vert</mat-icon>
            </button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
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
    
    .search-field {
      width: 100%;
      margin-bottom: 20px;
    }
    
    .astronauts-table {
      width: 100%;
    }
    
    .astronaut-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .name {
      font-weight: 500;
    }
    
    .person-id {
      font-weight: 500;
      color: #666;
      font-size: 0.9rem;
    }
    
    .source {
      color: #666;
      font-size: 0.8rem;
      font-style: italic;
    }
    
    .duty-title {
      font-weight: 500;
      color: #333;
    }
    
    .date-info {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #666;
      font-size: 0.9rem;
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
export class AstronautsComponent {
  displayedColumns: string[] = ['personId', 'name', 'currentRank', 'currentDutyTitle', 'careerStartDate', 'careerEndDate', 'actions'];
  
  // This represents the join between Person and AstronautDetail tables
  astronauts = [
    {
      // Person table fields
      personId: 1,
      name: 'Commander Sarah Chen',
      
      // AstronautDetail table fields
      currentRank: 'Commander',
      currentDutyTitle: 'Mission Commander',
      careerStartDate: new Date('2015-03-15'),
      careerEndDate: null
    },
    {
      personId: 2,
      name: 'Lt. Marcus Rodriguez',
      currentRank: 'Lieutenant',
      currentDutyTitle: 'Engineering Officer',
      careerStartDate: new Date('2018-06-20'),
      careerEndDate: null
    },
    {
      personId: 3,
      name: 'Dr. Elena Volkov',
      currentRank: 'Doctor',
      currentDutyTitle: 'Medical Officer',
      careerStartDate: new Date('2020-01-10'),
      careerEndDate: null
    },
    {
      personId: 4,
      name: 'Captain James Mitchell',
      currentRank: 'Captain',
      currentDutyTitle: 'Flight Director',
      careerStartDate: new Date('2010-09-05'),
      careerEndDate: new Date('2024-12-31')
    },
    {
      personId: 5,
      name: 'Lt. Commander Aisha Patel',
      currentRank: 'Lt. Commander',
      currentDutyTitle: 'Communications Officer',
      careerStartDate: new Date('2016-11-12'),
      careerEndDate: null
    }
  ];

}
