import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatliveComponent } from './chatlive.component';

describe('ChatliveComponent', () => {
  let component: ChatliveComponent;
  let fixture: ComponentFixture<ChatliveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatliveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatliveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
