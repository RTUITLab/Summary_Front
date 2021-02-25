import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectConferenceComponent } from './connect-conference.component';

describe('ConnectConferenceComponent', () => {
  let component: ConnectConferenceComponent;
  let fixture: ComponentFixture<ConnectConferenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConnectConferenceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectConferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
