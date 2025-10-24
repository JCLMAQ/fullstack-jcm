import { TestBed } from '@angular/core/testing';

import { IamRegister } from './iam-register';

describe('IamRegister', () => {
  let service: IamRegister;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IamRegister);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
