import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaqsComponent } from './faqs.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('FaqsComponent', () => {
  let component: FaqsComponent;
  let fixture: ComponentFixture<FaqsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FaqsComponent,
        HttpClientTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FaqsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
