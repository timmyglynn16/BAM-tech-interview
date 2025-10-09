import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { PersonsService, Person } from '../../services/persons.service';

@Component({
  selector: 'app-create-duty-dialog',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatDialogModule, MatButtonModule,
    MatInputModule, MatFormFieldModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule,
    MatRadioModule, MatAutocompleteModule
  ],
  template: `
    <h2 mat-dialog-title>Assign New Duty</h2>
    <mat-dialog-content>
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Person Name</mat-label>
        <input matInput 
               [(ngModel)]="selectedPersonName" 
               [matAutocomplete]="auto"
               (input)="onPersonInput($event)"
               (focus)="onPersonFieldFocus()"
               placeholder="Type to search or select person" 
               required>
        <mat-autocomplete #auto="matAutocomplete" (optionSelected)="onPersonSelected($event.option.value)">
          <mat-option *ngFor="let person of getVisiblePersons()" [value]="person.name">
            {{ person.name }}
          </mat-option>
        </mat-autocomplete>
      </mat-form-field>
      
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Rank</mat-label>
        <mat-select [(ngModel)]="dutyData.rank" required>
          <mat-option value="admiral">Admiral</mat-option>
          <mat-option value="captain">Captain</mat-option>
          <mat-option value="corporal">Corporal</mat-option>
          <mat-option value="lieutenant">Lieutenant</mat-option>
        </mat-select>
      </mat-form-field>
      
      <div class="duty-type-section">
        <mat-radio-group [(ngModel)]="dutyData.dutyType" (change)="onDutyTypeChange()">
          <mat-radio-button value="regular">Regular Duty</mat-radio-button>
          <mat-radio-button value="retired">Retirement</mat-radio-button>
        </mat-radio-group>
      </div>
      
      <mat-form-field appearance="outline" class="full-width" *ngIf="dutyData.dutyType === 'regular'">
        <mat-label>Duty Title</mat-label>
        <input matInput [(ngModel)]="dutyData.dutyTitle" placeholder="Enter duty title" required>
      </mat-form-field>
      
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Start Date</mat-label>
        <input matInput [matDatepicker]="startPicker" [(ngModel)]="dutyData.dutyStartDate" required>
        <mat-datepicker-toggle matSuffix [for]="startPicker"></mat-datepicker-toggle>
        <mat-datepicker #startPicker></mat-datepicker>
      </mat-form-field>
      
      <mat-form-field appearance="outline" class="full-width" *ngIf="dutyData.dutyType === 'regular'">
        <mat-label>End Date (Optional)</mat-label>
        <input matInput [matDatepicker]="endPicker" [(ngModel)]="dutyData.dutyEndDate">
        <mat-datepicker-toggle matSuffix [for]="endPicker"></mat-datepicker-toggle>
        <mat-datepicker #endPicker></mat-datepicker>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="primary" (click)="onCreate()" [disabled]="!isFormValid()">
        Assign Duty
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }
    
    .duty-type-section {
      margin-bottom: 16px;
    }
    
    .duty-type-section mat-radio-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
  `]
})
export class CreateDutyDialogComponent implements OnInit {
  dutyData = {
    name: '' as string | Person,
    rank: '',
    dutyTitle: '',
    dutyStartDate: new Date() as Date | null,
    dutyEndDate: null as Date | null,
    dutyType: 'regular' as 'regular' | 'retired'
  };

  selectedPersonName: string = '';
  persons: Person[] = [];
  filteredPersons: Person[] = [];
  showDropdown: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<CreateDutyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private personsService: PersonsService
  ) {}

  ngOnInit() {
    this.loadPersons();
    this.setupAutocomplete();
  }

  loadPersons() {
    this.personsService.getAllPersons().subscribe({
      next: (response) => {
        console.log('Full API response:', response);
        if (response.success && response.people) {
          // The API response structure is { people: [...] }
          this.persons = response.people as Person[];
          this.filteredPersons = [...this.persons];
          console.log('Loaded persons:', this.persons);
        } else {
          console.log('No people in response or not successful');
        }
      },
      error: (err) => {
        console.error('Error loading persons:', err);
      }
    });
  }

  setupAutocomplete() {
    // Filter persons based on input
    this.dutyData.name = '';
  }

  onPersonFieldFocus() {
    this.showDropdown = true;
    // Show all persons when field is focused
    this.filteredPersons = [...this.persons];
  }

  onPersonInput(event: any) {
    const value = event.target.value;
    this.selectedPersonName = value;
    console.log('Input value:', value);
    console.log('Available persons:', this.persons);
    
    if (value && value.length > 0) {
      this.filteredPersons = this.persons.filter(person =>
        person.name.toLowerCase().includes(value.toLowerCase())
      );
    } else {
      this.filteredPersons = [...this.persons];
    }
    console.log('Filtered persons:', this.filteredPersons);
  }

  onPersonSelected(selectedName: string) {
    this.selectedPersonName = selectedName;
    this.showDropdown = false; // Hide dropdown after selection
    
    // Auto-populate rank from selected person's current rank
    const selectedPerson = this.persons.find(person => person.name === selectedName);
    if (selectedPerson && selectedPerson.currentRank) {
      this.dutyData.rank = selectedPerson.currentRank;
    } else {
      // If no current rank, leave it blank for user to select
      this.dutyData.rank = '';
    }
  }

  getVisiblePersons(): Person[] {
    return this.showDropdown ? this.filteredPersons : [];
  }

  onDutyTypeChange() {
    if (this.dutyData.dutyType === 'retired') {
      this.dutyData.dutyTitle = 'RETIRED';
      this.dutyData.dutyStartDate = new Date(); // Set start date for retirement
      this.dutyData.dutyEndDate = null; // No end date for retirement
    } else {
      this.dutyData.dutyTitle = '';
      this.dutyData.dutyEndDate = null; // Clear end date for regular duties
      this.dutyData.dutyStartDate = new Date(); // Set start date for regular duties
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onCreate(): void {
    const result: any = {
      name: this.selectedPersonName,
      rank: this.dutyData.rank,
      dutyTitle: this.dutyData.dutyTitle
    };

    // Add start date for all duties (including retirement)
    if (this.dutyData.dutyStartDate) {
      result.dutyStartDate = this.dutyData.dutyStartDate.toISOString();
    }

    // Add end date only for regular duties (not retirement)
    if (this.dutyData.dutyType === 'regular' && this.dutyData.dutyEndDate) {
      result.dutyEndDate = this.dutyData.dutyEndDate.toISOString();
    }

    this.dialogRef.close(result);
  }

  isFormValid(): boolean {
    const hasName = this.selectedPersonName.trim().length > 0;
    const hasRank = !!this.dutyData.rank;
    const hasStartDate = !!this.dutyData.dutyStartDate;
    
    if (this.dutyData.dutyType === 'retired') {
      // For retirement, need name, rank, and start date (no end date)
      return !!(hasName && hasRank && hasStartDate);
    } else {
      // For regular duties, need name, rank, start date, and duty title
      return !!(hasName && hasRank && hasStartDate && this.dutyData.dutyTitle.trim());
    }
  }
}
