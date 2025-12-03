import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../environments/environment';

export interface CountyService {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  fees?: string;
  requirements?: string[];
  processingTime?: string;
  location?: string[];
  digitalAvailable?: boolean;
  featured?: boolean;
  contactInfo?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ServicesDataService {
  private apiUrl = `${environment.apiUrl}/services`;
  private servicesSubject = new BehaviorSubject<CountyService[]>([]);
  public services$: Observable<CountyService[]> = this.servicesSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadServices();
  }

  private loadServices(): void {
    this.http.get<CountyService[]>(this.apiUrl).pipe(
      tap(services => this.servicesSubject.next(services)),
      catchError(error => {
        console.error('Error loading services:', error);
        return [];
      })
    ).subscribe();
  }

  getServices(): Observable<CountyService[]> {
    return this.http.get<CountyService[]>(this.apiUrl).pipe(
      tap(services => this.servicesSubject.next(services))
    );
  }

  getServices$(): Observable<CountyService[]> {
    return this.services$;
  }

  getServiceById(id: string): Observable<CountyService> {
    return this.http.get<CountyService>(`${this.apiUrl}/${id}`);
  }

  addService(service: CountyService): Observable<CountyService> {
    return this.http.post<CountyService>(this.apiUrl, service).pipe(
      tap(() => this.loadServices())
    );
  }

  updateService(id: string, updatedService: CountyService): Observable<CountyService> {
    return this.http.put<CountyService>(`${this.apiUrl}/${id}`, updatedService).pipe(
      tap(() => this.loadServices())
    );
  }

  deleteService(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.loadServices())
    );
  }
}