import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ToupleService } from '../service/touple.service';

import { ToupleComponent } from './touple.component';

describe('Touple Management Component', () => {
  let comp: ToupleComponent;
  let fixture: ComponentFixture<ToupleComponent>;
  let service: ToupleService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'touple', component: ToupleComponent }]), HttpClientTestingModule],
      declarations: [ToupleComponent],
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
      .overrideTemplate(ToupleComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ToupleComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ToupleService);

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
    expect(comp.touples?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to toupleService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getToupleIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getToupleIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
