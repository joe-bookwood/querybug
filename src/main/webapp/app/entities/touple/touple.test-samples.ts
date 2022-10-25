import dayjs from 'dayjs/esm';

import { ITouple, NewTouple } from './touple.model';

export const sampleWithRequiredData: ITouple = {
  id: 68520,
};

export const sampleWithPartialData: ITouple = {
  id: 51460,
};

export const sampleWithFullData: ITouple = {
  id: 93540,
  computation: 21576,
  time: dayjs('2022-10-25T02:09'),
};

export const sampleWithNewData: NewTouple = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
