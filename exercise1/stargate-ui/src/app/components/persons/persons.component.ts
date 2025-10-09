import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { PersonsService, Person, CreatePersonRequest, UpdatePersonRequest } from '../../services/persons.service';
import { CreatePersonDialogComponent } from './create-person-dialog.component';
import { UpdatePersonDialogComponent } from './update-person-dialog.component';

@Component({
  selector: 'app-persons',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatTableModule, MatCardModule, MatButtonModule, 
    MatIconModule, MatInputModule, MatFormFieldModule, MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  template: `
    <div class="header">
      <h1>Personnel Management</h1>
      <button mat-raised-button color="primary" (click)="openCreatePersonDialog()">
        <mat-icon>add</mat-icon>
        Add Person
      </button>
    </div>

    <div class="card">
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>Search persons</mat-label>
          <input matInput placeholder="Person name" [(ngModel)]="searchTerm" (input)="filterPersons()">
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>

        <div *ngIf="loading" class="loading-container">
          <mat-spinner></mat-spinner>
          <p>Loading persons...</p>
        </div>

        <div *ngIf="error" class="error-container">
          <mat-icon color="warn">error</mat-icon>
          <p>{{ error }}</p>
          <button mat-button (click)="loadPersons()">Retry</button>
        </div>

        <table mat-table [dataSource]="filteredPersons" class="persons-table" *ngIf="!loading && !error">
        <ng-container matColumnDef="personId">
          <th mat-header-cell *matHeaderCellDef>ID</th>
          <td mat-cell *matCellDef="let person">
            <div class="person-id">
              {{ person.personId }}
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
              </div>
            </div>
          </td>
        </ng-container>

        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>Actions</th>
          <td mat-cell *matCellDef="let person">
            <button mat-icon-button (click)="openUpdatePersonDialog(person)">
              <mat-icon>edit</mat-icon>
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
export class PersonsComponent implements OnInit {
  displayedColumns: string[] = ['personId', 'name', 'actions'];
  
  persons: Person[] = [];
  filteredPersons: Person[] = [];
  loading = false;
  error: string | null = null;
  searchTerm = '';

  constructor(
    private personsService: PersonsService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadPersons();
  }

  loadPersons() {
    this.loading = true;
    this.error = null;
    
    this.personsService.getAllPersons().subscribe({
      next: (response) => {
        console.log('API Response:', response);
        this.loading = false;
        
        if (response.people && Array.isArray(response.people)) {
          this.persons = response.people;
          this.filteredPersons = [...this.persons];
        } else {
          this.error = response.message || 'Failed to load persons';
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Failed to load persons. Please check if the API is running.';
      }
    });
  }

  filterPersons() {
    if (!this.searchTerm.trim()) {
      this.filteredPersons = [...this.persons];
    } else {
      this.filteredPersons = this.persons.filter(person =>
        person.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  // Create Person Dialog Methods
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

  createPerson(name: string) {
    const request: CreatePersonRequest = {
      name: name,
      role: 0 // Default to Personnel
    };

    this.personsService.createPerson(request).subscribe({
      next: (response) => {
        if (response.success) {
          this.snackBar.open('Person created successfully!', 'Close', { duration: 3000 });
          this.loadPersons(); // Refresh the list
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

  // Update Person Dialog Methods
  openUpdatePersonDialog(person: Person) {
    const dialogRef = this.dialog.open(UpdatePersonDialogComponent, {
      width: '500px',
      data: { person: person }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.newName) {
        this.updatePerson(person, result.newName);
      }
    });
  }

  updatePerson(person: Person, newName: string) {
    const request: UpdatePersonRequest = {
      Name: person.name,
      NewName: newName
    };

    this.personsService.updatePerson(person.name, request).subscribe({
      next: (response) => {
        if (response.success) {
          this.snackBar.open('Person updated successfully!', 'Close', { duration: 3000 });
          this.loadPersons(); // Refresh the list
        } else {
          this.snackBar.open(response.message || 'Failed to update person', 'Close', { duration: 3000 });
        }
      },
      error: (err) => {
        this.snackBar.open('Error updating person: ' + err.message, 'Close', { duration: 3000 });
        console.error('Error updating person:', err);
      }
    });
  }
}
