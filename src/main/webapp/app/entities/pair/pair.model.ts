import { IAsset } from 'app/entities/asset/asset.model';

export interface IPair {
  id: number;
  name?: string | null;
  altname?: string | null;
  webSocketPairName?: string | null;
  lot?: string | null;
  pairDecimal?: number | null;
  lotDecimals?: number | null;
  lotMultiplier?: number | null;
  base?: Pick<IAsset, 'id'> | null;
  quote?: Pick<IAsset, 'id'> | null;
}

export type NewPair = Omit<IPair, 'id'> & { id: null };
