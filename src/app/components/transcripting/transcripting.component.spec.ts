import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranscriptingComponent } from './transcripting.component';

describe('TranscriptingComponent', () => {
  let component: TranscriptingComponent;
  let fixture: ComponentFixture<TranscriptingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TranscriptingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TranscriptingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
