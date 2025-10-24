import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Changepwd } from './changepwd';

describe('Changepwd', () => {
  let component: Changepwd;
  let fixture: ComponentFixture<Changepwd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Changepwd],
    }).compileComponents();

    fixture = TestBed.createComponent(Changepwd);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
