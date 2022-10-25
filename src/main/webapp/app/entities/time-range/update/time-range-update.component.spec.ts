import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { TimeRangeFormService } from './time-range-form.service';
import { TimeRangeService } from '../service/time-range.service';
import { ITimeRange } from '../time-range.model';

import { TimeRangeUpdateComponent } from './time-range-update.component';

describe('TimeRange Management Update Component', () => {
  let comp: TimeRangeUpdateComponent;
  let fixture: ComponentFixture<TimeRangeUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let timeRangeFormService: TimeRangeFormService;
  let timeRangeService: TimeRangeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [TimeRangeUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(TimeRangeUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TimeRangeUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    timeRangeFormService = TestBed.inject(TimeRangeFormService);
    timeRangeService = TestBed.inject(TimeRangeService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const timeRange: ITimeRange = { id: 456 };

      activatedRoute.data = of({ timeRange });
      comp.ngOnInit();

      expect(comp.timeRange).toEqual(timeRange);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITimeRange>>();
      const timeRange = { id: 123 };
      jest.spyOn(timeRangeFormService, 'getTimeRange').mockReturnValue(timeRange);
      jest.spyOn(timeRangeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ timeRange });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: timeRange }));
      saveSubject.complete();

      // THEN
      expect(timeRangeFormService.getTimeRange).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(timeRangeService.update).toHaveBeenCalledWith(expect.objectContaining(timeRange));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITimeRange>>();
      const timeRange = { id: 123 };
      jest.spyOn(timeRangeFormService, 'getTimeRange').mockReturnValue({ id: null });
      jest.spyOn(timeRangeService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ timeRange: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: timeRange }));
      saveSubject.complete();

      // THEN
      expect(timeRangeFormService.getTimeRange).toHaveBeenCalled();
      expect(timeRangeService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITimeRange>>();
      const timeRange = { id: 123 };
      jest.spyOn(timeRangeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ timeRange });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(timeRangeService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
