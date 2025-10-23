import { TestBed } from '@angular/core/testing';

import { AvatarBase64 } from './avatar-base64';

describe('AvatarBase64', () => {
  let service: AvatarBase64;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AvatarBase64);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
