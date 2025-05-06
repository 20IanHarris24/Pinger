import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAllShipsComponent } from './show.all.ships.component';

describe('DisplayallshipsComponent', () => {
  let component: ShowAllShipsComponent;
  let fixture: ComponentFixture<ShowAllShipsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowAllShipsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowAllShipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
