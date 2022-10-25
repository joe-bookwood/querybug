import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { FeeDetailComponent } from './fee-detail.component';

describe('Fee Management Detail Component', () => {
  let comp: FeeDetailComponent;
  let fixture: ComponentFixture<FeeDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FeeDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ fee: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(FeeDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(FeeDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load fee on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.fee).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
