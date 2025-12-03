import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../environments/environment';

export interface Tender {
  id: string;
  title: string;
  description: string;
  category: string;
  openingDate: string;
  closingDate: string;
  status: 'open' | 'closed' | 'awarded';
  value?: number;
  documentUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TendersService {
  private apiUrl = `${environment.apiUrl}/tenders`;
  private tendersSubject = new BehaviorSubject<Tender[]>([]);
  public tenders$: Observable<Tender[]> = this.tendersSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadTenders();
  }

  private loadTenders(): void {
    this.http.get<Tender[]>(this.apiUrl).pipe(
      tap(tenders => this.tendersSubject.next(tenders)),
      catchError(error => {
        console.error('Error loading tenders:', error);
        return [];
      })
    ).subscribe();
  }

  getTenders(): Observable<Tender[]> {
    return this.http.get<Tender[]>(this.apiUrl).pipe(
      tap(tenders => this.tendersSubject.next(tenders))
    );
  }

  getTenders$(): Observable<Tender[]> {
    return this.tenders$;
  }

  getTenderById(id: string): Observable<Tender> {
    return this.http.get<Tender>(`${this.apiUrl}/${id}`);
  }

  addTender(tender: Tender): Observable<Tender> {
    return this.http.post<Tender>(this.apiUrl, tender).pipe(
      tap(() => this.loadTenders())
    );
  }

  updateTender(id: string, updatedTender: Tender): Observable<Tender> {
    return this.http.put<Tender>(`${this.apiUrl}/${id}`, updatedTender).pipe(
      tap(() => this.loadTenders())
    );
  }

  deleteTender(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.loadTenders())
    );
  }
}