import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { TupleService } from '../service/tuple.service';

import { TupleComponent } from './tuple.component';

describe('Tuple Management Component', () => {
  let comp: TupleComponent;
  let fixture: ComponentFixture<TupleComponent>;
  let service: TupleService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'tuple', component: TupleComponent }]), HttpClientTestingModule],
      declarations: [TupleComponent],
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
      .overrideTemplate(TupleComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TupleComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(TupleService);

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
    expect(comp.tuples?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to tupleService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getTupleIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getTupleIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
