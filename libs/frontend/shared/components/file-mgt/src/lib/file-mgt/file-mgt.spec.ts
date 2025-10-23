import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FileMgt } from './file-mgt';

describe('FileMgt', () => {
  let component: FileMgt;
  let fixture: ComponentFixture<FileMgt>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileMgt],
    }).compileComponents();

    fixture = TestBed.createComponent(FileMgt);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
