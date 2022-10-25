import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ChartService } from '../service/chart.service';

import { ChartComponent } from './chart.component';

describe('Chart Management Component', () => {
  let comp: ChartComponent;
  let fixture: ComponentFixture<ChartComponent>;
  let service: ChartService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'chart', component: ChartComponent }]), HttpClientTestingModule],
      declarations: [ChartComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(ChartComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ChartComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ChartService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.charts?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to chartService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getChartIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getChartIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
