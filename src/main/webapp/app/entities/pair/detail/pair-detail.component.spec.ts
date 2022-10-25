import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PairDetailComponent } from './pair-detail.component';

describe('Pair Management Detail Component', () => {
  let comp: PairDetailComponent;
  let fixture: ComponentFixture<PairDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PairDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ pair: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(PairDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(PairDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load pair on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.pair).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
