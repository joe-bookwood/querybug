import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CalculationDetailComponent } from './calculation-detail.component';

describe('Calculation Management Detail Component', () => {
  let comp: CalculationDetailComponent;
  let fixture: ComponentFixture<CalculationDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CalculationDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ calculation: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(CalculationDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(CalculationDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load calculation on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.calculation).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
