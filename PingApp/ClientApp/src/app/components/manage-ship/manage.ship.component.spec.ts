import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageShipComponent } from './manage.ship.component';

describe('ManageshipComponent', () => {
  let component: ManageShipComponent;
  let fixture: ComponentFixture<ManageShipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageShipComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageShipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
