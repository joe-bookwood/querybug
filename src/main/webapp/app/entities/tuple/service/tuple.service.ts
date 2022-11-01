import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITuple, NewTuple } from '../tuple.model';

export type PartialUpdateTuple = Partial<ITuple> & Pick<ITuple, 'id'>;

type RestOf<T extends ITuple | NewTuple> = Omit<T, 'time'> & {
  time?: string | null;
};

export type RestTuple = RestOf<ITuple>;

export type NewRestTuple = RestOf<NewTuple>;

export type PartialUpdateRestTuple = RestOf<PartialUpdateTuple>;

export type EntityResponseType = HttpResponse<ITuple>;
export type EntityArrayResponseType = HttpResponse<ITuple[]>;

@Injectable({ providedIn: 'root' })
export class TupleService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/tuples');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(tuple: NewTuple): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(tuple);
    return this.http.post<RestTuple>(this.resourceUrl, copy, { observe: 'response' }).pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(tuple: ITuple): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(tuple);
    return this.http
      .put<RestTuple>(`${this.resourceUrl}/${this.getTupleIdentifier(tuple)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(tuple: PartialUpdateTuple): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(tuple);
    return this.http
      .patch<RestTuple>(`${this.resourceUrl}/${this.getTupleIdentifier(tuple)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestTuple>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestTuple[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getTupleIdentifier(tuple: Pick<ITuple, 'id'>): number {
    return tuple.id;
  }

  compareTuple(o1: Pick<ITuple, 'id'> | null, o2: Pick<ITuple, 'id'> | null): boolean {
    return o1 && o2 ? this.getTupleIdentifier(o1) === this.getTupleIdentifier(o2) : o1 === o2;
  }

  addTupleToCollectionIfMissing<Type extends Pick<ITuple, 'id'>>(
    tupleCollection: Type[],
    ...tuplesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const tuples: Type[] = tuplesToCheck.filter(isPresent);
    if (tuples.length > 0) {
      const tupleCollectionIdentifiers = tupleCollection.map(tupleItem => this.getTupleIdentifier(tupleItem)!);
      const tuplesToAdd = tuples.filter(tupleItem => {
        const tupleIdentifier = this.getTupleIdentifier(tupleItem);
        if (tupleCollectionIdentifiers.includes(tupleIdentifier)) {
          return false;
        }
        tupleCollectionIdentifiers.push(tupleIdentifier);
        return true;
      });
      return [...tuplesToAdd, ...tupleCollection];
    }
    return tupleCollection;
  }

  protected convertDateFromClient<T extends ITuple | NewTuple | PartialUpdateTuple>(tuple: T): RestOf<T> {
    return {
      ...tuple,
      time: tuple.time?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restTuple: RestTuple): ITuple {
    return {
      ...restTuple,
      time: restTuple.time ? dayjs(restTuple.time) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestTuple>): HttpResponse<ITuple> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestTuple[]>): HttpResponse<ITuple[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
