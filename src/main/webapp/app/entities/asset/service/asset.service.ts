import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAsset, NewAsset } from '../asset.model';

export type PartialUpdateAsset = Partial<IAsset> & Pick<IAsset, 'id'>;

type RestOf<T extends IAsset | NewAsset> = Omit<T, 'lastChecked'> & {
  lastChecked?: string | null;
};

export type RestAsset = RestOf<IAsset>;

export type NewRestAsset = RestOf<NewAsset>;

export type PartialUpdateRestAsset = RestOf<PartialUpdateAsset>;

export type EntityResponseType = HttpResponse<IAsset>;
export type EntityArrayResponseType = HttpResponse<IAsset[]>;

@Injectable({ providedIn: 'root' })
export class AssetService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/assets');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(asset: NewAsset): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(asset);
    return this.http.post<RestAsset>(this.resourceUrl, copy, { observe: 'response' }).pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(asset: IAsset): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(asset);
    return this.http
      .put<RestAsset>(`${this.resourceUrl}/${this.getAssetIdentifier(asset)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(asset: PartialUpdateAsset): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(asset);
    return this.http
      .patch<RestAsset>(`${this.resourceUrl}/${this.getAssetIdentifier(asset)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestAsset>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestAsset[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getAssetIdentifier(asset: Pick<IAsset, 'id'>): number {
    return asset.id;
  }

  compareAsset(o1: Pick<IAsset, 'id'> | null, o2: Pick<IAsset, 'id'> | null): boolean {
    return o1 && o2 ? this.getAssetIdentifier(o1) === this.getAssetIdentifier(o2) : o1 === o2;
  }

  addAssetToCollectionIfMissing<Type extends Pick<IAsset, 'id'>>(
    assetCollection: Type[],
    ...assetsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const assets: Type[] = assetsToCheck.filter(isPresent);
    if (assets.length > 0) {
      const assetCollectionIdentifiers = assetCollection.map(assetItem => this.getAssetIdentifier(assetItem)!);
      const assetsToAdd = assets.filter(assetItem => {
        const assetIdentifier = this.getAssetIdentifier(assetItem);
        if (assetCollectionIdentifiers.includes(assetIdentifier)) {
          return false;
        }
        assetCollectionIdentifiers.push(assetIdentifier);
        return true;
      });
      return [...assetsToAdd, ...assetCollection];
    }
    return assetCollection;
  }

  protected convertDateFromClient<T extends IAsset | NewAsset | PartialUpdateAsset>(asset: T): RestOf<T> {
    return {
      ...asset,
      lastChecked: asset.lastChecked?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restAsset: RestAsset): IAsset {
    return {
      ...restAsset,
      lastChecked: restAsset.lastChecked ? dayjs(restAsset.lastChecked) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestAsset>): HttpResponse<IAsset> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestAsset[]>): HttpResponse<IAsset[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
