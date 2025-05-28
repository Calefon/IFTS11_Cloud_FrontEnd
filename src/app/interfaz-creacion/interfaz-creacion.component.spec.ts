import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterfazCreacionComponent } from './interfaz-creacion.component';

describe('InterfazCreacionComponent', () => {
  let component: InterfazCreacionComponent;
  let fixture: ComponentFixture<InterfazCreacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InterfazCreacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InterfazCreacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
