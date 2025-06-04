import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupInputComponent } from './popup-input.component';

describe('PopupInputComponent', () => {
  let component: PopupInputComponent;
  let fixture: ComponentFixture<PopupInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopupInputComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
