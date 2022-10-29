import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { TupleDetailComponent } from './tuple-detail.component';

describe('Tuple Management Detail Component', () => {
  let comp: TupleDetailComponent;
  let fixture: ComponentFixture<TupleDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TupleDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ tuple: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(TupleDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(TupleDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load tuple on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.tuple).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
