import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ToupleDetailComponent } from './touple-detail.component';

describe('Touple Management Detail Component', () => {
  let comp: ToupleDetailComponent;
  let fixture: ComponentFixture<ToupleDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ToupleDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ touple: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ToupleDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ToupleDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load touple on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.touple).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
