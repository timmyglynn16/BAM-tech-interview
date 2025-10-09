import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService, ApiResponse } from './api.service';

export interface Person {
  personId: number;
  name: string;
  currentRank: string;
  currentDutyTitle: string;
  careerStartDate: string | null;
  careerEndDate: string | null;
}

export interface CreatePersonRequest {
  name: string;
  role: number;
}

export interface UpdatePersonRequest {
  Name: string;
  NewName: string;
  role?: number;
}

@Injectable({
  providedIn: 'root'
})
export class PersonsService {
  constructor(private apiService: ApiService) { }

  getAllPersons(): Observable<ApiResponse<{ people: Person[] }>> {
    return this.apiService.get<{ people: Person[] }>('person');
  }

  getPersonByName(name: string): Observable<ApiResponse<Person>> {
    return this.apiService.get<Person>(`person/${encodeURIComponent(name)}`);
  }

  createPerson(request: CreatePersonRequest): Observable<ApiResponse<any>> {
    return this.apiService.post<any>('person', request);
  }

  updatePerson(name: string, request: UpdatePersonRequest): Observable<ApiResponse<any>> {
    return this.apiService.put<any>(`person/${encodeURIComponent(name)}`, request);
  }
}
