import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { environment } from '@environments/environment';

export interface RevenueStream {
  name: string;
  description?: string;
}

export interface Department {
  id: string;
  name: string;
  shortName?: string;
  icon: string;
  description: string;
  revenueStreams: RevenueStream[];
  totalRevenue?: number;
}

@Injectable({
  providedIn: 'root'
})
export class DepartmentsService {
  private apiUrl = `${environment.apiUrl}/departments`;
  private departmentsSubject = new BehaviorSubject<Department[]>([]);
  public departments$: Observable<Department[]> = this.departmentsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadDepartments();
  }

  private loadDepartments(): void {
    this.http.get<Department[]>(this.apiUrl).pipe(
      tap(departments => this.departmentsSubject.next(departments)),
      catchError(error => {
        console.error('Error loading departments:', error);
        return [];
      })
    ).subscribe();
  }

  getDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(this.apiUrl).pipe(
      tap(departments => this.departmentsSubject.next(departments))
    );
  }

  getDepartments$(): Observable<Department[]> {
    return this.departments$;
  }

  getDepartmentById(id: string): Observable<Department> {
    return this.http.get<Department>(`${this.apiUrl}/${id}`);
  }

  addDepartment(department: Department): Observable<Department> {
    return this.http.post<Department>(this.apiUrl, department).pipe(
      tap(() => this.loadDepartments())
    );
  }

  updateDepartment(id: string, updatedDepartment: Department): Observable<Department> {
    return this.http.put<Department>(`${this.apiUrl}/${id}`, updatedDepartment).pipe(
      tap(() => this.loadDepartments())
    );
  }

  deleteDepartment(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.loadDepartments())
    );
  }

  getTotalRevenue(): Observable<number> {
    return this.departments$.pipe(
      map(departments => departments.reduce(
        (total, dept) => total + (dept.totalRevenue || 0),
        0
      ))
    );
  }
}