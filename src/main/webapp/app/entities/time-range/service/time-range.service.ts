import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITimeRange, NewTimeRange } from '../time-range.model';

export type PartialUpdateTimeRange = Partial<ITimeRange> & Pick<ITimeRange, 'id'>;

export type EntityResponseType = HttpResponse<ITimeRange>;
export type EntityArrayResponseType = HttpResponse<ITimeRange[]>;

@Injectable({ providedIn: 'root' })
export class TimeRangeService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/time-ranges');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(timeRange: NewTimeRange): Observable<EntityResponseType> {
    return this.http.post<ITimeRange>(this.resourceUrl, timeRange, { observe: 'response' });
  }

  update(timeRange: ITimeRange): Observable<EntityResponseType> {
    return this.http.put<ITimeRange>(`${this.resourceUrl}/${this.getTimeRangeIdentifier(timeRange)}`, timeRange, { observe: 'response' });
  }

  partialUpdate(timeRange: PartialUpdateTimeRange): Observable<EntityResponseType> {
    return this.http.patch<ITimeRange>(`${this.resourceUrl}/${this.getTimeRangeIdentifier(timeRange)}`, timeRange, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ITimeRange>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITimeRange[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getTimeRangeIdentifier(timeRange: Pick<ITimeRange, 'id'>): number {
    return timeRange.id;
  }

  compareTimeRange(o1: Pick<ITimeRange, 'id'> | null, o2: Pick<ITimeRange, 'id'> | null): boolean {
    return o1 && o2 ? this.getTimeRangeIdentifier(o1) === this.getTimeRangeIdentifier(o2) : o1 === o2;
  }

  addTimeRangeToCollectionIfMissing<Type extends Pick<ITimeRange, 'id'>>(
    timeRangeCollection: Type[],
    ...timeRangesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const timeRanges: Type[] = timeRangesToCheck.filter(isPresent);
    if (timeRanges.length > 0) {
      const timeRangeCollectionIdentifiers = timeRangeCollection.map(timeRangeItem => this.getTimeRangeIdentifier(timeRangeItem)!);
      const timeRangesToAdd = timeRanges.filter(timeRangeItem => {
        const timeRangeIdentifier = this.getTimeRangeIdentifier(timeRangeItem);
        if (timeRangeCollectionIdentifiers.includes(timeRangeIdentifier)) {
          return false;
        }
        timeRangeCollectionIdentifiers.push(timeRangeIdentifier);
        return true;
      });
      return [...timeRangesToAdd, ...timeRangeCollection];
    }
    return timeRangeCollection;
  }
}
