import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { TimeRangeDetailComponent } from './time-range-detail.component';

describe('TimeRange Management Detail Component', () => {
  let comp: TimeRangeDetailComponent;
  let fixture: ComponentFixture<TimeRangeDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TimeRangeDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ timeRange: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(TimeRangeDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(TimeRangeDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load timeRange on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.timeRange).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
