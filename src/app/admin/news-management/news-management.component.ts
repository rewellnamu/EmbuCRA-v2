import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { NewsService, NewsArticle } from '../../services/news.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-news-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './news-management.component.html',
  styleUrl: './news-management.component.scss'
})
export class NewsManagementComponent implements OnInit, OnDestroy {
  news: NewsArticle[] = [];
  showModal = false;
  editMode = false;
  currentArticle: NewsArticle | null = null;
  newsForm!: FormGroup;
  searchTerm = '';
  isLoading = false;
  private subscription?: Subscription;

  categories = [
    'Technology',
    'Public Notice',
    'Health',
    'Infrastructure',
    'Education',
    'Agriculture',
    'Finance',
    'Environment',
    'General'
  ];

  constructor(
    private fb: FormBuilder,
    private newsService: NewsService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadNews();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  initForm(): void {
    this.newsForm = this.fb.group({
      title: ['', Validators.required],
      summary: ['', Validators.required],
      content: ['', Validators.required],
      category: ['', Validators.required],
      author: ['', Validators.required],
      publishDate: ['', Validators.required],
      featured: [false],
      imageUrl: [''],
      tags: ['']
    });
  }

  loadNews(): void {
    this.subscription = this.newsService.news$.subscribe(
      articles => {
        this.news = articles;
      }
    );
  }

  get filteredNews(): NewsArticle[] {
    if (!this.searchTerm) return this.news;
    
    const term = this.searchTerm.toLowerCase();
    return this.news.filter(article => 
      article.title.toLowerCase().includes(term) ||
      article.summary.toLowerCase().includes(term) ||
      article.category.toLowerCase().includes(term) ||
      article.author.toLowerCase().includes(term)
    );
  }

  openModal(article?: NewsArticle): void {
    this.showModal = true;
    
    if (article) {
      this.editMode = true;
      this.currentArticle = article;
      this.newsForm.patchValue({
        title: article.title,
        summary: article.summary,
        content: article.content,
        category: article.category,
        author: article.author,
        publishDate: article.publishDate,
        featured: article.featured || false,
        imageUrl: article.imageUrl || '',
        tags: article.tags?.join(', ') || ''
      });
    } else {
      this.editMode = false;
      this.currentArticle = null;
      const today = new Date().toISOString().split('T')[0];
      this.newsForm.reset({ 
        featured: false, 
        publishDate: today,
        author: 'County Communications'
      });
    }
  }

  closeModal(): void {
    this.showModal = false;
    this.editMode = false;
    this.currentArticle = null;
    this.newsForm.reset();
  }

  onSubmit(): void {
    if (this.newsForm.invalid) return;

    this.isLoading = true;
    const formValue = this.newsForm.value;
    
    const tags = formValue.tags 
      ? formValue.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag)
      : [];

    const articleData: NewsArticle = {
      id: this.editMode && this.currentArticle 
        ? this.currentArticle.id 
        : 'news-' + Date.now(),
      title: formValue.title,
      summary: formValue.summary,
      content: formValue.content,
      category: formValue.category,
      author: formValue.author,
      publishDate: formValue.publishDate,
      featured: formValue.featured,
      imageUrl: formValue.imageUrl || undefined,
      tags: tags.length > 0 ? tags : undefined
    };

    const request = this.editMode && this.currentArticle
      ? this.newsService.updateNews(this.currentArticle.id, articleData)
      : this.newsService.addNews(articleData);

    request.subscribe({
      next: () => {
        this.closeModal();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error saving news:', error);
        alert('Failed to save news article. Please try again.');
        this.isLoading = false;
      }
    });
  }

  deleteArticle(article: NewsArticle): void {
    if (confirm(`Are you sure you want to delete "${article.title}"?`)) {
      this.isLoading = true;
      this.newsService.deleteNews(article.id).subscribe({
        next: () => {
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error deleting news:', error);
          alert('Failed to delete news article. Please try again.');
          this.isLoading = false;
        }
      });
    }
  }

  toggleFeatured(article: NewsArticle): void {
    this.isLoading = true;
    const updatedArticle = { ...article, featured: !article.featured };
    this.newsService.updateNews(article.id, updatedArticle).subscribe({
      next: () => {
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error updating news:', error);
        alert('Failed to update news article. Please try again.');
        this.isLoading = false;
      }
    });
  }

  trackByArticleId(index: number, article: NewsArticle): string {
    return article.id;
  }

  getExcerpt(content: string, maxLength: number = 150): string {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  }
}