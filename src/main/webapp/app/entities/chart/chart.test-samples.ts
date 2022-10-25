import dayjs from 'dayjs/esm';

import { IChart, NewChart } from './chart.model';

export const sampleWithRequiredData: IChart = {
  id: 11304,
};

export const sampleWithPartialData: IChart = {
  id: 85859,
  name: 'adapter',
  maxCount: 58423,
  disabled: true,
};

export const sampleWithFullData: IChart = {
  id: 9544,
  name: 'payment',
  last: dayjs('2022-10-25T04:47'),
  maxCount: 90841,
  disabled: false,
};

export const sampleWithNewData: NewChart = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
