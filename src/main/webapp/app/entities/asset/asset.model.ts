import dayjs from 'dayjs/esm';

export interface IAsset {
  id: number;
  name?: string | null;
  assetClass?: string | null;
  alternativeName?: string | null;
  decimals?: number | null;
  displayDecimals?: number | null;
  lastChecked?: dayjs.Dayjs | null;
}

export type NewAsset = Omit<IAsset, 'id'> & { id: null };
