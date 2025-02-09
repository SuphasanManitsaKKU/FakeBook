import { TestBed } from '@angular/core/testing';

import { NotificationServiceSocket } from './notificationSocket.service';

describe('NotificationService', () => {
  let service: NotificationServiceSocket;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationServiceSocket);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
