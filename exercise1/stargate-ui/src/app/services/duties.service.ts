import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService, ApiResponse } from './api.service';

export interface AstronautDuty {
  id: number;
  personId: number;
  rank: string;
  dutyTitle: string;
  dutyStartDate: string;
  dutyEndDate?: string | null;
}

export interface AstronautDutyWithPerson {
  id: number;
  personId: number;
  rank: string;
  dutyTitle: string;
  dutyStartDate: string;
  dutyEndDate?: string | null;
  personName: string;
}

export interface PersonAstronaut {
  personId: number;
  name: string;
  currentRank: string;
  currentDutyTitle: string;
  careerStartDate: string;
  careerEndDate?: string | null;
}

export interface GetAstronautDutiesResult {
  person?: PersonAstronaut;
  astronautDuties: AstronautDuty[];
}

export interface CreateDutyRequest {
  name: string;
  rank: string;
  dutyTitle: string;
  dutyStartDate: string; // ISO date string
  dutyEndDate?: string; // ISO date string, optional for retirement
}

@Injectable({
  providedIn: 'root'
})
export class DutiesService {
  constructor(private apiService: ApiService) { }

  getAllDuties(): Observable<ApiResponse<AstronautDutyWithPerson[]>> {
    return this.apiService.get<AstronautDutyWithPerson[]>('astronautduty');
  }

  getAstronautDutiesByName(name: string): Observable<ApiResponse<GetAstronautDutiesResult>> {
    return this.apiService.get<GetAstronautDutiesResult>(`astronautduty/${encodeURIComponent(name)}`);
  }

  createDuty(request: CreateDutyRequest): Observable<ApiResponse<any>> {
    return this.apiService.post<any>('astronautduty', request);
  }
}
