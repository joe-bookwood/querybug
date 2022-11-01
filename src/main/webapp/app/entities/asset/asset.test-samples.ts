import dayjs from 'dayjs/esm';

import { IAsset, NewAsset } from './asset.model';

export const sampleWithRequiredData: IAsset = {
  id: 64724,
};

export const sampleWithPartialData: IAsset = {
  id: 9020,
  alternativeName: 'Borders',
  displayDecimals: 44342,
};

export const sampleWithFullData: IAsset = {
  id: 63014,
  name: 'Brand',
  assetClass: 'Hat',
  alternativeName: 'Plastic Kids Michigan',
  decimals: 26259,
  displayDecimals: 65783,
  lastChecked: dayjs('2022-10-24T23:24'),
};

export const sampleWithNewData: NewAsset = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
