import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IFee, NewFee } from '../fee.model';

export type PartialUpdateFee = Partial<IFee> & Pick<IFee, 'id'>;

export type EntityResponseType = HttpResponse<IFee>;
export type EntityArrayResponseType = HttpResponse<IFee[]>;

@Injectable({ providedIn: 'root' })
export class FeeService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/fees');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(fee: NewFee): Observable<EntityResponseType> {
    return this.http.post<IFee>(this.resourceUrl, fee, { observe: 'response' });
  }

  update(fee: IFee): Observable<EntityResponseType> {
    return this.http.put<IFee>(`${this.resourceUrl}/${this.getFeeIdentifier(fee)}`, fee, { observe: 'response' });
  }

  partialUpdate(fee: PartialUpdateFee): Observable<EntityResponseType> {
    return this.http.patch<IFee>(`${this.resourceUrl}/${this.getFeeIdentifier(fee)}`, fee, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IFee>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IFee[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getFeeIdentifier(fee: Pick<IFee, 'id'>): number {
    return fee.id;
  }

  compareFee(o1: Pick<IFee, 'id'> | null, o2: Pick<IFee, 'id'> | null): boolean {
    return o1 && o2 ? this.getFeeIdentifier(o1) === this.getFeeIdentifier(o2) : o1 === o2;
  }

  addFeeToCollectionIfMissing<Type extends Pick<IFee, 'id'>>(feeCollection: Type[], ...feesToCheck: (Type | null | undefined)[]): Type[] {
    const fees: Type[] = feesToCheck.filter(isPresent);
    if (fees.length > 0) {
      const feeCollectionIdentifiers = feeCollection.map(feeItem => this.getFeeIdentifier(feeItem)!);
      const feesToAdd = fees.filter(feeItem => {
        const feeIdentifier = this.getFeeIdentifier(feeItem);
        if (feeCollectionIdentifiers.includes(feeIdentifier)) {
          return false;
        }
        feeCollectionIdentifiers.push(feeIdentifier);
        return true;
      });
      return [...feesToAdd, ...feeCollection];
    }
    return feeCollection;
  }
}
