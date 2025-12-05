import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadsComponent } from './downloads.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('DownloadsComponent', () => {
  let component: DownloadsComponent;
  let fixture: ComponentFixture<DownloadsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DownloadsComponent,
        HttpClientTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DownloadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
