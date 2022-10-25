import { IPair, NewPair } from './pair.model';

export const sampleWithRequiredData: IPair = {
  id: 79233,
};

export const sampleWithPartialData: IPair = {
  id: 30836,
  lot: 'Aruban',
  lotDecimals: 500,
  lotMultiplier: 62491,
};

export const sampleWithFullData: IPair = {
  id: 81911,
  name: 'Tobago blockchains',
  altname: 'primary leading-edge Regional',
  webSocketPairName: 'visualize',
  lot: 'Eritrea Personal Chilean',
  pairDecimal: 82908,
  lotDecimals: 6909,
  lotMultiplier: 45444,
};

export const sampleWithNewData: NewPair = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
