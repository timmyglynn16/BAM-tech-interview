import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Person } from '../../services/persons.service';

@Component({
  selector: 'app-update-person-dialog',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatDialogModule, MatButtonModule, 
    MatInputModule, MatFormFieldModule
  ],
  template: `
    <h2 mat-dialog-title>Update Person</h2>
    <mat-dialog-content>
      <mat-form-field appearance="outline" class="full-width">
        <input matInput [(ngModel)]="personName" placeholder="Enter new name" required>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="primary" (click)="onUpdate()" [disabled]="!personName?.trim()">
        Update
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .full-width {
      width: 100%;
    }
  `]
})
export class UpdatePersonDialogComponent {
  personName = '';

  constructor(
    public dialogRef: MatDialogRef<UpdatePersonDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { person: Person }
  ) {
    this.personName = data.person.name;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onUpdate(): void {
    if (this.personName.trim()) {
      this.dialogRef.close({ newName: this.personName.trim() });
    }
  }
}
