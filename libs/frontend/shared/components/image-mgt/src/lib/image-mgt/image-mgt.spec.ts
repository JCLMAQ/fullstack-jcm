import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImageMgt } from './image-mgt';

describe('ImageMgt', () => {
  let component: ImageMgt;
  let fixture: ComponentFixture<ImageMgt>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageMgt],
    }).compileComponents();

    fixture = TestBed.createComponent(ImageMgt);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
