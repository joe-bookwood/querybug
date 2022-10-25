import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IChart, NewChart } from '../chart.model';

export type PartialUpdateChart = Partial<IChart> & Pick<IChart, 'id'>;

type RestOf<T extends IChart | NewChart> = Omit<T, 'last'> & {
  last?: string | null;
};

export type RestChart = RestOf<IChart>;

export type NewRestChart = RestOf<NewChart>;

export type PartialUpdateRestChart = RestOf<PartialUpdateChart>;

export type EntityResponseType = HttpResponse<IChart>;
export type EntityArrayResponseType = HttpResponse<IChart[]>;

@Injectable({ providedIn: 'root' })
export class ChartService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/charts');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(chart: NewChart): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(chart);
    return this.http.post<RestChart>(this.resourceUrl, copy, { observe: 'response' }).pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(chart: IChart): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(chart);
    return this.http
      .put<RestChart>(`${this.resourceUrl}/${this.getChartIdentifier(chart)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(chart: PartialUpdateChart): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(chart);
    return this.http
      .patch<RestChart>(`${this.resourceUrl}/${this.getChartIdentifier(chart)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestChart>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestChart[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getChartIdentifier(chart: Pick<IChart, 'id'>): number {
    return chart.id;
  }

  compareChart(o1: Pick<IChart, 'id'> | null, o2: Pick<IChart, 'id'> | null): boolean {
    return o1 && o2 ? this.getChartIdentifier(o1) === this.getChartIdentifier(o2) : o1 === o2;
  }

  addChartToCollectionIfMissing<Type extends Pick<IChart, 'id'>>(
    chartCollection: Type[],
    ...chartsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const charts: Type[] = chartsToCheck.filter(isPresent);
    if (charts.length > 0) {
      const chartCollectionIdentifiers = chartCollection.map(chartItem => this.getChartIdentifier(chartItem)!);
      const chartsToAdd = charts.filter(chartItem => {
        const chartIdentifier = this.getChartIdentifier(chartItem);
        if (chartCollectionIdentifiers.includes(chartIdentifier)) {
          return false;
        }
        chartCollectionIdentifiers.push(chartIdentifier);
        return true;
      });
      return [...chartsToAdd, ...chartCollection];
    }
    return chartCollection;
  }

  protected convertDateFromClient<T extends IChart | NewChart | PartialUpdateChart>(chart: T): RestOf<T> {
    return {
      ...chart,
      last: chart.last?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restChart: RestChart): IChart {
    return {
      ...restChart,
      last: restChart.last ? dayjs(restChart.last) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestChart>): HttpResponse<IChart> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestChart[]>): HttpResponse<IChart[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
