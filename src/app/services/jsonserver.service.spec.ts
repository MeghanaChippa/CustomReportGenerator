import { TestBed } from '@angular/core/testing';

import { JsonserverService } from './jsonserver.service';

describe('JsonserverService', () => {
  let service: JsonserverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JsonserverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
