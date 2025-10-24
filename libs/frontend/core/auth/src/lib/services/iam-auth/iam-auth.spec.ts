import { TestBed } from '@angular/core/testing';

import { IamAuth } from './iam-auth';

describe('IamAuth', () => {
  let service: IamAuth;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IamAuth);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
