import { ComponentFixture, TestBed } from "@angular/core/testing";

import { NewShipModalComponent } from "./new.ship.modal.component";

describe("ModalManageShipComponent", () => {
  let component: NewShipModalComponent;
  let fixture: ComponentFixture<NewShipModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewShipModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NewShipModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
