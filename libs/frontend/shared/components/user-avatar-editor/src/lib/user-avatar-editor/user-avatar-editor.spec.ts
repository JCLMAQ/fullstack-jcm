import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserAvatarEditor } from './user-avatar-editor';

describe('UserAvatarEditor', () => {
  let component: UserAvatarEditor;
  let fixture: ComponentFixture<UserAvatarEditor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserAvatarEditor],
    }).compileComponents();

    fixture = TestBed.createComponent(UserAvatarEditor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
