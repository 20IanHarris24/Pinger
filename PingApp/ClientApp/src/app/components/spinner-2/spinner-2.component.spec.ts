import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Spinner2Component } from './spinner-2.component';

describe('Spinner2Component', () => {
  let component: Spinner2Component;
  let fixture: ComponentFixture<Spinner2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Spinner2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Spinner2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
