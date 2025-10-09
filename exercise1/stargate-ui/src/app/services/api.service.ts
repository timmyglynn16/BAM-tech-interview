import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  responseCode: number;
  data?: T;
  people?: T;
  astronautDuties?: T;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:5204';

  constructor(private http: HttpClient) { }

  get<T>(endpoint: string): Observable<ApiResponse<T>> {
    const url = `${this.baseUrl}/${endpoint}`;
    return this.http.get<ApiResponse<T>>(url)
      .pipe(
        catchError(this.handleError)
      );
  }

  post<T>(endpoint: string, data: any): Observable<ApiResponse<T>> {
    return this.http.post<ApiResponse<T>>(`${this.baseUrl}/${endpoint}`, data)
      .pipe(
        catchError(this.handleError)
      );
  }

  put<T>(endpoint: string, data: any): Observable<ApiResponse<T>> {
    return this.http.put<ApiResponse<T>>(`${this.baseUrl}/${endpoint}`, data)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      if (error.error && error.error.message) {
        errorMessage = error.error.message;
      }
      
      // Check for CORS errors
      if (error.status === 0) {
        errorMessage = 'CORS Error: Unable to connect to the API. Please check if the backend is running and CORS is configured.';
      }
    }
    console.error('API Error:', error);
    console.error('Error Message:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
