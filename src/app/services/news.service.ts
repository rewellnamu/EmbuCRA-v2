import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { environment } from '@environments/environment';

export interface NewsArticle {
  id: string;
  title: string;
  content: string;
  summary: string;
  category: string;
  author: string;
  publishDate: string;
  imageUrl?: string;
  featured?: boolean;
  tags?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private apiUrl = `${environment.apiUrl}/news`;
  private newsSubject = new BehaviorSubject<NewsArticle[]>([]);
  public news$: Observable<NewsArticle[]> = this.newsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadNews();
  }

  private loadNews(): void {
    this.http.get<NewsArticle[]>(this.apiUrl).pipe(
      tap(news => this.newsSubject.next(news)),
      catchError(error => {
        console.error('Error loading news:', error);
        return [];
      })
    ).subscribe();
  }

  getNews(): Observable<NewsArticle[]> {
    return this.http.get<NewsArticle[]>(this.apiUrl).pipe(
      tap(news => this.newsSubject.next(news))
    );
  }

  getNews$(): Observable<NewsArticle[]> {
    return this.news$;
  }

  getNewsById(id: string): Observable<NewsArticle> {
    return this.http.get<NewsArticle>(`${this.apiUrl}/${id}`);
  }

  addNews(article: NewsArticle): Observable<NewsArticle> {
    return this.http.post<NewsArticle>(this.apiUrl, article).pipe(
      tap(() => this.loadNews())
    );
  }

  updateNews(id: string, updatedArticle: NewsArticle): Observable<NewsArticle> {
    return this.http.put<NewsArticle>(`${this.apiUrl}/${id}`, updatedArticle).pipe(
      tap(() => this.loadNews())
    );
  }

  deleteNews(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.loadNews())
    );
  }

  getFeaturedNews(): Observable<NewsArticle[]> {
    return this.news$.pipe(
      map(news => news.filter(article => article.featured))
    );
  }

  getNewsByCategory(category: string): Observable<NewsArticle[]> {
    return this.news$.pipe(
      map(news => news.filter(article => article.category === category))
    );
  }
}