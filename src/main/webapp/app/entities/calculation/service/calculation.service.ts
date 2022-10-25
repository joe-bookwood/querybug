import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICalculation, NewCalculation } from '../calculation.model';

export type PartialUpdateCalculation = Partial<ICalculation> & Pick<ICalculation, 'id'>;

type RestOf<T extends ICalculation | NewCalculation> = Omit<T, 'last'> & {
  last?: string | null;
};

export type RestCalculation = RestOf<ICalculation>;

export type NewRestCalculation = RestOf<NewCalculation>;

export type PartialUpdateRestCalculation = RestOf<PartialUpdateCalculation>;

export type EntityResponseType = HttpResponse<ICalculation>;
export type EntityArrayResponseType = HttpResponse<ICalculation[]>;

@Injectable({ providedIn: 'root' })
export class CalculationService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/calculations');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(calculation: NewCalculation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(calculation);
    return this.http
      .post<RestCalculation>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(calculation: ICalculation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(calculation);
    return this.http
      .put<RestCalculation>(`${this.resourceUrl}/${this.getCalculationIdentifier(calculation)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(calculation: PartialUpdateCalculation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(calculation);
    return this.http
      .patch<RestCalculation>(`${this.resourceUrl}/${this.getCalculationIdentifier(calculation)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestCalculation>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestCalculation[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getCalculationIdentifier(calculation: Pick<ICalculation, 'id'>): number {
    return calculation.id;
  }

  compareCalculation(o1: Pick<ICalculation, 'id'> | null, o2: Pick<ICalculation, 'id'> | null): boolean {
    return o1 && o2 ? this.getCalculationIdentifier(o1) === this.getCalculationIdentifier(o2) : o1 === o2;
  }

  addCalculationToCollectionIfMissing<Type extends Pick<ICalculation, 'id'>>(
    calculationCollection: Type[],
    ...calculationsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const calculations: Type[] = calculationsToCheck.filter(isPresent);
    if (calculations.length > 0) {
      const calculationCollectionIdentifiers = calculationCollection.map(
        calculationItem => this.getCalculationIdentifier(calculationItem)!
      );
      const calculationsToAdd = calculations.filter(calculationItem => {
        const calculationIdentifier = this.getCalculationIdentifier(calculationItem);
        if (calculationCollectionIdentifiers.includes(calculationIdentifier)) {
          return false;
        }
        calculationCollectionIdentifiers.push(calculationIdentifier);
        return true;
      });
      return [...calculationsToAdd, ...calculationCollection];
    }
    return calculationCollection;
  }

  protected convertDateFromClient<T extends ICalculation | NewCalculation | PartialUpdateCalculation>(calculation: T): RestOf<T> {
    return {
      ...calculation,
      last: calculation.last?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restCalculation: RestCalculation): ICalculation {
    return {
      ...restCalculation,
      last: restCalculation.last ? dayjs(restCalculation.last) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestCalculation>): HttpResponse<ICalculation> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestCalculation[]>): HttpResponse<ICalculation[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
