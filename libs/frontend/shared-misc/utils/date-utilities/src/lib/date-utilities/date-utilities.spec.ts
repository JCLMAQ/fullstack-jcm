import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DateUtilities } from './date-utilities';

describe('DateUtilities', () => {
  let component: DateUtilities;
  let fixture: ComponentFixture<DateUtilities>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DateUtilities],
    }).compileComponents();

    fixture = TestBed.createComponent(DateUtilities);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
