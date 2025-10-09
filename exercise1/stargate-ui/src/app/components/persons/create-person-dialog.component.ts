import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-create-person-dialog',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatDialogModule, MatButtonModule, 
    MatInputModule, MatFormFieldModule
  ],
  template: `
    <h2 mat-dialog-title>Add New Person</h2>
    <mat-dialog-content>
      <mat-form-field appearance="outline" class="full-width">
        <input matInput [(ngModel)]="personName" placeholder="Enter person name" required>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="primary" (click)="onCreate()" [disabled]="!personName.trim()">
        Create
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .full-width {
      width: 100%;
    }
  `]
})
export class CreatePersonDialogComponent {
  personName = '';

  constructor(
    public dialogRef: MatDialogRef<CreatePersonDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onCreate(): void {
    if (this.personName.trim()) {
      this.dialogRef.close({ name: this.personName.trim() });
    }
  }
}
