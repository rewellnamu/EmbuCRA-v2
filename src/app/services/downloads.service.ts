import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../environments/environment';

export interface Download {
  id: string;
  title: string;
  description: string;
  category: string;
  fileType: string;
  fileSize?: string;
  fileUrl: string;
  uploadDate: string;
  downloadCount?: number;
}

@Injectable({
  providedIn: 'root'
})
export class DownloadsService {
  private apiUrl = `${environment.apiUrl}/downloads`;
  private downloadsSubject = new BehaviorSubject<Download[]>([]);
  public downloads$: Observable<Download[]> = this.downloadsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadDownloads();
  }

  private loadDownloads(): void {
    this.http.get<Download[]>(this.apiUrl).pipe(
      tap(downloads => this.downloadsSubject.next(downloads)),
      catchError(error => {
        console.error('Error loading downloads:', error);
        return [];
      })
    ).subscribe();
  }

  getDownloads(): Observable<Download[]> {
    return this.http.get<Download[]>(this.apiUrl).pipe(
      tap(downloads => this.downloadsSubject.next(downloads))
    );
  }

  getDownloads$(): Observable<Download[]> {
    return this.downloads$;
  }

  getDownloadById(id: string): Observable<Download> {
    return this.http.get<Download>(`${this.apiUrl}/${id}`);
  }

  addDownload(download: Download): Observable<Download> {
    return this.http.post<Download>(this.apiUrl, download).pipe(
      tap(() => this.loadDownloads())
    );
  }

  updateDownload(id: string, updatedDownload: Download): Observable<Download> {
    return this.http.put<Download>(`${this.apiUrl}/${id}`, updatedDownload).pipe(
      tap(() => this.loadDownloads())
    );
  }

  deleteDownload(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.loadDownloads())
    );
  }

  incrementDownloadCount(id: string): Observable<Download> {
    return this.getDownloadById(id).pipe(
      tap(download => {
        const updated = { 
          ...download, 
          downloadCount: (download.downloadCount || 0) + 1 
        };
        this.updateDownload(id, updated).subscribe();
      })
    );
  }
}