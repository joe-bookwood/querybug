import dayjs from 'dayjs/esm';

import { IOhlc, NewOhlc } from './ohlc.model';

export const sampleWithRequiredData: IOhlc = {
  id: 35747,
};

export const sampleWithPartialData: IOhlc = {
  id: 9551,
  high: 48664,
  close: 82279,
  volumeWeightedAveragePrice: 62815,
  volume: 45927,
};

export const sampleWithFullData: IOhlc = {
  id: 31656,
  time: dayjs('2022-10-25T01:10'),
  open: 79954,
  high: 76470,
  low: 63169,
  close: 56904,
  volumeWeightedAveragePrice: 61289,
  volume: 66745,
  count: 65910,
};

export const sampleWithNewData: NewOhlc = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
