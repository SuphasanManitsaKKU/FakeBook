import { TestBed } from '@angular/core/testing';

import { UserPublicService } from './userPublic.service';

describe('UserPublicService', () => {
  let service: UserPublicService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserPublicService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
