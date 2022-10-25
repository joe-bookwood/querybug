import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { OhlcDetailComponent } from './ohlc-detail.component';

describe('Ohlc Management Detail Component', () => {
  let comp: OhlcDetailComponent;
  let fixture: ComponentFixture<OhlcDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OhlcDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ ohlc: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(OhlcDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(OhlcDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load ohlc on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.ohlc).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
