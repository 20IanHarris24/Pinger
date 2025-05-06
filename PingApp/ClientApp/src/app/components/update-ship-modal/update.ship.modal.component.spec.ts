import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateShipModalComponent } from './update.ship.modal.component';

describe('UpdateShipModalComponent', () => {
  let component: UpdateShipModalComponent;
  let fixture: ComponentFixture<UpdateShipModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateShipModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateShipModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
