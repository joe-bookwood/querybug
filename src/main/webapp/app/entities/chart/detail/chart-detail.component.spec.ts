import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ChartDetailComponent } from './chart-detail.component';

describe('Chart Management Detail Component', () => {
  let comp: ChartDetailComponent;
  let fixture: ComponentFixture<ChartDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChartDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ chart: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ChartDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ChartDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load chart on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.chart).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
