import dayjs from 'dayjs/esm';

import { ICalculation, NewCalculation } from './calculation.model';

export const sampleWithRequiredData: ICalculation = {
  id: 39089,
};

export const sampleWithPartialData: ICalculation = {
  id: 80210,
  last: dayjs('2022-10-25T06:54'),
};

export const sampleWithFullData: ICalculation = {
  id: 3161,
  name: 'Strategist navigate mint',
  last: dayjs('2022-10-25T03:44'),
  disabled: true,
};

export const sampleWithNewData: NewCalculation = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
