import { TestBed } from '@angular/core/testing';

import { ChatliveService } from './chatlive.service';

describe('ChatliveService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ChatliveService = TestBed.get(ChatliveService);
    expect(service).toBeTruthy();
  });
});
