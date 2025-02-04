import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedUserComponent } from './feed-user.component';

describe('FeedUserComponent', () => {
  let component: FeedUserComponent;
  let fixture: ComponentFixture<FeedUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeedUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeedUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
