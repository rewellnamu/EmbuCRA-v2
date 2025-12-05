import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevenueStreamsComponent } from './revenue-streams.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('RevenueStreamsComponent', () => {
  let component: RevenueStreamsComponent;
  let fixture: ComponentFixture<RevenueStreamsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RevenueStreamsComponent,
        HttpClientTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RevenueStreamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
