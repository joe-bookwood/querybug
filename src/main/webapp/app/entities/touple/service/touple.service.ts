import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITouple, NewTouple } from '../touple.model';

export type PartialUpdateTouple = Partial<ITouple> & Pick<ITouple, 'id'>;

type RestOf<T extends ITouple | NewTouple> = Omit<T, 'time'> & {
  time?: string | null;
};

export type RestTouple = RestOf<ITouple>;

export type NewRestTouple = RestOf<NewTouple>;

export type PartialUpdateRestTouple = RestOf<PartialUpdateTouple>;

export type EntityResponseType = HttpResponse<ITouple>;
export type EntityArrayResponseType = HttpResponse<ITouple[]>;

@Injectable({ providedIn: 'root' })
export class ToupleService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/touples');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(touple: NewTouple): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(touple);
    return this.http
      .post<RestTouple>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(touple: ITouple): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(touple);
    return this.http
      .put<RestTouple>(`${this.resourceUrl}/${this.getToupleIdentifier(touple)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(touple: PartialUpdateTouple): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(touple);
    return this.http
      .patch<RestTouple>(`${this.resourceUrl}/${this.getToupleIdentifier(touple)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestTouple>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestTouple[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getToupleIdentifier(touple: Pick<ITouple, 'id'>): number {
    return touple.id;
  }

  compareTouple(o1: Pick<ITouple, 'id'> | null, o2: Pick<ITouple, 'id'> | null): boolean {
    return o1 && o2 ? this.getToupleIdentifier(o1) === this.getToupleIdentifier(o2) : o1 === o2;
  }

  addToupleToCollectionIfMissing<Type extends Pick<ITouple, 'id'>>(
    toupleCollection: Type[],
    ...touplesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const touples: Type[] = touplesToCheck.filter(isPresent);
    if (touples.length > 0) {
      const toupleCollectionIdentifiers = toupleCollection.map(toupleItem => this.getToupleIdentifier(toupleItem)!);
      const touplesToAdd = touples.filter(toupleItem => {
        const toupleIdentifier = this.getToupleIdentifier(toupleItem);
        if (toupleCollectionIdentifiers.includes(toupleIdentifier)) {
          return false;
        }
        toupleCollectionIdentifiers.push(toupleIdentifier);
        return true;
      });
      return [...touplesToAdd, ...toupleCollection];
    }
    return toupleCollection;
  }

  protected convertDateFromClient<T extends ITouple | NewTouple | PartialUpdateTouple>(touple: T): RestOf<T> {
    return {
      ...touple,
      time: touple.time?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restTouple: RestTouple): ITouple {
    return {
      ...restTouple,
      time: restTouple.time ? dayjs(restTouple.time) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestTouple>): HttpResponse<ITouple> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestTouple[]>): HttpResponse<ITouple[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
