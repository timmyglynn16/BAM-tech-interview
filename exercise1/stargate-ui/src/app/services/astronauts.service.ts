import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService, ApiResponse } from './api.service';

export interface PersonAstronaut {
  personId: number;
  name: string;
  currentRank: string;
  currentDutyTitle: string;
  careerStartDate: string;
  careerEndDate?: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class AstronautsService {
  constructor(private apiService: ApiService) { }

  getAllAstronauts(): Observable<ApiResponse<PersonAstronaut[]>> {
    return this.apiService.get<PersonAstronaut[]>('person/astronauts');
  }

  getAstronautByName(name: string): Observable<ApiResponse<PersonAstronaut>> {
    return this.apiService.get<PersonAstronaut>(`person/${encodeURIComponent(name)}`);
  }
}
