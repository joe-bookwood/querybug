import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { AssetDetailComponent } from './asset-detail.component';

describe('Asset Management Detail Component', () => {
  let comp: AssetDetailComponent;
  let fixture: ComponentFixture<AssetDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssetDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ asset: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(AssetDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(AssetDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load asset on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.asset).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
