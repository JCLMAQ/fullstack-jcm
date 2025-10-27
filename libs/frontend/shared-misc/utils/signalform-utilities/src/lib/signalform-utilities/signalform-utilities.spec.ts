import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignalformUtilities } from './signalform-utilities';

describe('SignalformUtilities', () => {
  let component: SignalformUtilities;
  let fixture: ComponentFixture<SignalformUtilities>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignalformUtilities],
    }).compileComponents();

    fixture = TestBed.createComponent(SignalformUtilities);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
