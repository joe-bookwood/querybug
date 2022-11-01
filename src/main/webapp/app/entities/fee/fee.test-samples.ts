import { IFee, NewFee } from './fee.model';

export const sampleWithRequiredData: IFee = {
  id: 94452,
};

export const sampleWithPartialData: IFee = {
  id: 52810,
  volume: 76538,
};

export const sampleWithFullData: IFee = {
  id: 4573,
  volume: 16810,
  percent: 2364,
};

export const sampleWithNewData: NewFee = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
