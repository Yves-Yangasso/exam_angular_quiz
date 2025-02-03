import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccueilParDefautComponent } from './accueil-par-defaut.component';

describe('AccueilParDefautComponent', () => {
  let component: AccueilParDefautComponent;
  let fixture: ComponentFixture<AccueilParDefautComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccueilParDefautComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccueilParDefautComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
