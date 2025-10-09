import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-persons',
  standalone: true,
  imports: [
    CommonModule, MatTableModule, MatCardModule, MatButtonModule, 
    MatIconModule, MatInputModule, MatFormFieldModule
  ],
  template: `
    <div class="header">
      <h1>Personnel Management</h1>
      <button mat-raised-button color="primary">
        <mat-icon>add</mat-icon>
        Add Person
      </button>
    </div>

    <div class="card">
      <mat-form-field appearance="outline" class="search-field">
        <mat-label>Search persons</mat-label>
        <input matInput placeholder="Person name">
        <mat-icon matSuffix>search</mat-icon>
      </mat-form-field>

      <table mat-table [dataSource]="persons" class="persons-table">
        <ng-container matColumnDef="id">
          <th mat-header-cell *matHeaderCellDef>ID</th>
          <td mat-cell *matCellDef="let person">
            <div class="person-id">
              {{ person.id }}
            </div>
          </td>
        </ng-container>

        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef>Name</th>
          <td mat-cell *matCellDef="let person">
            <div class="person-info">
              <mat-icon>person</mat-icon>
              <div>
                <div class="name">{{ person.name }}</div>
                <div class="type" [class.astronaut]="person.isAstronaut">
                  {{ person.isAstronaut ? 'Astronaut' : 'Personnel' }}
                </div>
              </div>
            </div>
          </td>
        </ng-container>

        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>Actions</th>
          <td mat-cell *matCellDef="let person">
            <button mat-icon-button>
              <mat-icon>more_vert</mat-icon>
            </button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns" class="header-row"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="data-row"></tr>
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
    
    .persons-table {
      width: 100%;
    }
    
    .header-row {
      background-color: #f5f5f5;
    }
    
    .data-row {
      height: 70px;
    }
    
    .data-row:hover {
      background-color: #f8f9fa;
    }
    
    .person-id {
      font-weight: 500;
      color: #666;
      font-size: 0.9rem;
    }
    
    .person-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .name {
      font-weight: 500;
      font-size: 1rem;
    }
    
    .type {
      color: #666;
      font-size: 0.85rem;
      margin-top: 2px;
    }
    
    .type.astronaut {
      color: #1976d2;
      font-weight: 500;
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
export class PersonsComponent {
  displayedColumns: string[] = ['id', 'name', 'actions'];
  
  persons = [
    {
      id: 1,
      name: 'Commander Sarah Chen',
      isAstronaut: true
    },
    {
      id: 2,
      name: 'Lt. Marcus Rodriguez',
      isAstronaut: true
    },
    {
      id: 3,
      name: 'Dr. Elena Volkov',
      isAstronaut: true
    },
    {
      id: 4,
      name: 'Captain James Mitchell',
      isAstronaut: true
    },
    {
      id: 5,
      name: 'Lt. Commander Aisha Patel',
      isAstronaut: true
    },
    {
      id: 6,
      name: 'Dr. Michael Thompson',
      isAstronaut: false
    },
    {
      id: 7,
      name: 'Engineer Lisa Wang',
      isAstronaut: false
    },
    {
      id: 8,
      name: 'Technician Robert Kim',
      isAstronaut: false
    }
  ];
}
