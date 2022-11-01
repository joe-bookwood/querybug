import dayjs from 'dayjs/esm';

import { ITuple, NewTuple } from './tuple.model';

export const sampleWithRequiredData: ITuple = {
  id: 60425,
};

export const sampleWithPartialData: ITuple = {
  id: 69383,
};

export const sampleWithFullData: ITuple = {
  id: 55794,
  computation: 94286,
  time: dayjs('2022-10-24T18:04'),
};

export const sampleWithNewData: NewTuple = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
