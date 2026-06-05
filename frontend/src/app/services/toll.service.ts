import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  TollLog,
  CreateTollLogDto,
  UpdateStatusDto,
} from '../models/toll-log.model';

@Injectable({ providedIn: 'root' })
export class TollService {
  private http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000';

  /** GET /logs — fetch all toll records */
  getLogs(): Observable<TollLog[]> {
    return this.http.get<TollLog[]>(`${this.apiUrl}/logs`);
  }

  /** POST /logs — create a new vehicle entry */
  createLog(dto: CreateTollLogDto): Observable<TollLog> {
    return this.http.post<TollLog>(`${this.apiUrl}/logs`, dto);
  }

  /** PATCH /logs/:id/status — update status of a log */
  updateStatus(id: string, dto: UpdateStatusDto): Observable<TollLog> {
    return this.http.patch<TollLog>(`${this.apiUrl}/logs/${id}/status`, dto);
  }
  /** DELETE /logs/:id — remove a log entry */
  deleteLog(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/logs/${id}`);
  }
}
