import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteShipModalComponent } from './delete.ship.modal.component';

describe('DeleteShipModalComponent', () => {
  let component: DeleteShipModalComponent;
  let fixture: ComponentFixture<DeleteShipModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteShipModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteShipModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
