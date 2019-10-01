import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatliveComponent } from './chatlive.component';
import { ChatliveService } from './chatlive.service';
import { FormsModule } from '@angular/forms';

describe('ChatliveComponent', () => {
  let component: ChatliveComponent;
  let fixture: ComponentFixture<ChatliveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [ChatliveComponent],
      providers: [ChatliveService]
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
