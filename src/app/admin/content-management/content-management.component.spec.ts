import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentManagementComponent } from './content-management.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ContentManagementComponent', () => {
  let component: ContentManagementComponent;
  let fixture: ComponentFixture<ContentManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentManagementComponent,
        HttpClientTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContentManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
