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
import { AstronautsService, PersonAstronaut } from '../../services/astronauts.service';

@Component({
  selector: 'app-astronauts',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatTableModule, MatCardModule, MatButtonModule, 
    MatIconModule, MatChipsModule, MatInputModule, MatFormFieldModule, MatProgressSpinnerModule
  ],
  template: `
    <div class="header">
      <h1>Astronaut Management</h1>
    </div>

    <div class="card">
      <mat-form-field appearance="outline" class="search-field">
        <mat-label>Search astronauts</mat-label>
        <input matInput placeholder="Name, rank, or duty title" [(ngModel)]="searchTerm" (input)="filterAstronauts()">
        <mat-icon matSuffix>search</mat-icon>
      </mat-form-field>

      <div *ngIf="loading" class="loading-container">
        <mat-spinner></mat-spinner>
        <p>Loading astronauts...</p>
      </div>

      <div *ngIf="error" class="error-container">
        <mat-icon color="warn">error</mat-icon>
        <p>{{ error }}</p>
        <button mat-button (click)="loadAstronauts()">Retry</button>
      </div>

      <div *ngIf="!loading && !error && filteredAstronauts.length === 0" class="no-data-container">
        <mat-icon>person_off</mat-icon>
        <h3>No Astronauts Found</h3>
        <p>No astronauts have been assigned duties yet.</p>
      </div>

      <table mat-table [dataSource]="filteredAstronauts" class="astronauts-table" *ngIf="!loading && !error && filteredAstronauts.length > 0">
        <ng-container matColumnDef="personId">
          <th mat-header-cell *matHeaderCellDef>Person ID</th>
          <td mat-cell *matCellDef="let astronaut">
            <div class="person-id">
              {{ astronaut.personId }}
            </div>
          </td>
        </ng-container>

        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef>Name</th>
          <td mat-cell *matCellDef="let astronaut">
            <div class="astronaut-info">
              <mat-icon>person</mat-icon>
              <div>
                <div class="name">{{ astronaut.name }}</div>
              </div>
            </div>
          </td>
        </ng-container>

        <ng-container matColumnDef="currentRank">
          <th mat-header-cell *matHeaderCellDef>Current Rank</th>
          <td mat-cell *matCellDef="let astronaut">
            <mat-chip color="primary" selected>
              {{ astronaut.currentRank }}
            </mat-chip>
          </td>
        </ng-container>

        <ng-container matColumnDef="currentDutyTitle">
          <th mat-header-cell *matHeaderCellDef>Current Duty</th>
          <td mat-cell *matCellDef="let astronaut">
            <div class="duty-title">
              {{ astronaut.currentDutyTitle }}
            </div>
          </td>
        </ng-container>

        <ng-container matColumnDef="careerStartDate">
          <th mat-header-cell *matHeaderCellDef>Career Start</th>
          <td mat-cell *matCellDef="let astronaut">
            <div class="date-info">
              <mat-icon>calendar_today</mat-icon>
              {{ astronaut.careerStartDate | date:'MMM dd, yyyy' }}
            </div>
          </td>
        </ng-container>

        <ng-container matColumnDef="careerEndDate">
          <th mat-header-cell *matHeaderCellDef>Career End</th>
          <td mat-cell *matCellDef="let astronaut">
            <div class="date-info" *ngIf="astronaut.careerEndDate; else activeStatus">
              <mat-icon>event_busy</mat-icon>
              {{ astronaut.careerEndDate | date:'MMM dd, yyyy' }}
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
    
    .loading-container, .error-container, .no-data-container {
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
    
    .no-data-container {
      color: #666;
    }
    
    .no-data-container mat-icon {
      font-size: 4rem;
      width: 4rem;
      height: 4rem;
      opacity: 0.5;
    }
    
    .no-data-container h3 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 400;
    }
    
    .no-data-container p {
      margin: 0;
      opacity: 0.8;
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
export class AstronautsComponent implements OnInit {
  displayedColumns: string[] = ['personId', 'name', 'currentRank', 'currentDutyTitle', 'careerStartDate', 'careerEndDate', 'actions'];
  
  astronauts: PersonAstronaut[] = [];
  filteredAstronauts: PersonAstronaut[] = [];
  loading = false;
  error: string | null = null;
  searchTerm = '';

  constructor(private astronautsService: AstronautsService) {}

  ngOnInit() {
    this.loadAstronauts();
  }

  loadAstronauts() {
    this.loading = true;
    this.error = null;
    
    this.astronautsService.getAllAstronauts().subscribe({
      next: (response) => {
        console.log('All astronauts response:', response);
        this.loading = false;
        
        if (response.success) {
          this.astronauts = (response.astronauts as PersonAstronaut[]) || [];
          this.filteredAstronauts = [...this.astronauts];
        } else {
          this.error = response.message || 'Failed to load astronauts';
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Failed to load astronauts. Please check if the API is running.';
        console.error('Error loading astronauts:', err);
      }
    });
  }

  filterAstronauts() {
    let filtered = [...this.astronauts];

    // Search filter
    if (this.searchTerm.trim()) {
      filtered = filtered.filter(astronaut =>
        astronaut.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        astronaut.currentRank.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        astronaut.currentDutyTitle.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
    this.filteredAstronauts = filtered;
  }
}
