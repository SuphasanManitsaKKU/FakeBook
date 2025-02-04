import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputCommentComponent } from './input-comment.component';

describe('InputCommentComponent', () => {
  let component: InputCommentComponent;
  let fixture: ComponentFixture<InputCommentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputCommentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
