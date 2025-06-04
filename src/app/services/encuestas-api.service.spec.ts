import { TestBed } from '@angular/core/testing';

import { EncuestasApiService } from './encuestas-api.service';

describe('EncuestasApiService', () => {
  let service: EncuestasApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EncuestasApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
