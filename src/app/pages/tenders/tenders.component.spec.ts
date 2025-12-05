import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TendersComponent } from './tenders.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('TendersComponent', () => {
  let component: TendersComponent;
  let fixture: ComponentFixture<TendersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TendersComponent,
        HttpClientTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TendersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
