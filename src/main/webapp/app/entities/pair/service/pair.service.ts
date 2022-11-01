import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPair, NewPair } from '../pair.model';

export type PartialUpdatePair = Partial<IPair> & Pick<IPair, 'id'>;

export type EntityResponseType = HttpResponse<IPair>;
export type EntityArrayResponseType = HttpResponse<IPair[]>;

@Injectable({ providedIn: 'root' })
export class PairService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/pairs');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(pair: NewPair): Observable<EntityResponseType> {
    return this.http.post<IPair>(this.resourceUrl, pair, { observe: 'response' });
  }

  update(pair: IPair): Observable<EntityResponseType> {
    return this.http.put<IPair>(`${this.resourceUrl}/${this.getPairIdentifier(pair)}`, pair, { observe: 'response' });
  }

  partialUpdate(pair: PartialUpdatePair): Observable<EntityResponseType> {
    return this.http.patch<IPair>(`${this.resourceUrl}/${this.getPairIdentifier(pair)}`, pair, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IPair>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPair[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getPairIdentifier(pair: Pick<IPair, 'id'>): number {
    return pair.id;
  }

  comparePair(o1: Pick<IPair, 'id'> | null, o2: Pick<IPair, 'id'> | null): boolean {
    return o1 && o2 ? this.getPairIdentifier(o1) === this.getPairIdentifier(o2) : o1 === o2;
  }

  addPairToCollectionIfMissing<Type extends Pick<IPair, 'id'>>(
    pairCollection: Type[],
    ...pairsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const pairs: Type[] = pairsToCheck.filter(isPresent);
    if (pairs.length > 0) {
      const pairCollectionIdentifiers = pairCollection.map(pairItem => this.getPairIdentifier(pairItem)!);
      const pairsToAdd = pairs.filter(pairItem => {
        const pairIdentifier = this.getPairIdentifier(pairItem);
        if (pairCollectionIdentifiers.includes(pairIdentifier)) {
          return false;
        }
        pairCollectionIdentifiers.push(pairIdentifier);
        return true;
      });
      return [...pairsToAdd, ...pairCollection];
    }
    return pairCollection;
  }
}
