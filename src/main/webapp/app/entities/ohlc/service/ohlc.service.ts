import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IOhlc, NewOhlc } from '../ohlc.model';

export type PartialUpdateOhlc = Partial<IOhlc> & Pick<IOhlc, 'id'>;

type RestOf<T extends IOhlc | NewOhlc> = Omit<T, 'time'> & {
  time?: string | null;
};

export type RestOhlc = RestOf<IOhlc>;

export type NewRestOhlc = RestOf<NewOhlc>;

export type PartialUpdateRestOhlc = RestOf<PartialUpdateOhlc>;

export type EntityResponseType = HttpResponse<IOhlc>;
export type EntityArrayResponseType = HttpResponse<IOhlc[]>;

@Injectable({ providedIn: 'root' })
export class OhlcService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/ohlcs');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(ohlc: NewOhlc): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(ohlc);
    return this.http.post<RestOhlc>(this.resourceUrl, copy, { observe: 'response' }).pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(ohlc: IOhlc): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(ohlc);
    return this.http
      .put<RestOhlc>(`${this.resourceUrl}/${this.getOhlcIdentifier(ohlc)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(ohlc: PartialUpdateOhlc): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(ohlc);
    return this.http
      .patch<RestOhlc>(`${this.resourceUrl}/${this.getOhlcIdentifier(ohlc)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestOhlc>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestOhlc[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getOhlcIdentifier(ohlc: Pick<IOhlc, 'id'>): number {
    return ohlc.id;
  }

  compareOhlc(o1: Pick<IOhlc, 'id'> | null, o2: Pick<IOhlc, 'id'> | null): boolean {
    return o1 && o2 ? this.getOhlcIdentifier(o1) === this.getOhlcIdentifier(o2) : o1 === o2;
  }

  addOhlcToCollectionIfMissing<Type extends Pick<IOhlc, 'id'>>(
    ohlcCollection: Type[],
    ...ohlcsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const ohlcs: Type[] = ohlcsToCheck.filter(isPresent);
    if (ohlcs.length > 0) {
      const ohlcCollectionIdentifiers = ohlcCollection.map(ohlcItem => this.getOhlcIdentifier(ohlcItem)!);
      const ohlcsToAdd = ohlcs.filter(ohlcItem => {
        const ohlcIdentifier = this.getOhlcIdentifier(ohlcItem);
        if (ohlcCollectionIdentifiers.includes(ohlcIdentifier)) {
          return false;
        }
        ohlcCollectionIdentifiers.push(ohlcIdentifier);
        return true;
      });
      return [...ohlcsToAdd, ...ohlcCollection];
    }
    return ohlcCollection;
  }

  protected convertDateFromClient<T extends IOhlc | NewOhlc | PartialUpdateOhlc>(ohlc: T): RestOf<T> {
    return {
      ...ohlc,
      time: ohlc.time?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restOhlc: RestOhlc): IOhlc {
    return {
      ...restOhlc,
      time: restOhlc.time ? dayjs(restOhlc.time) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestOhlc>): HttpResponse<IOhlc> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestOhlc[]>): HttpResponse<IOhlc[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
