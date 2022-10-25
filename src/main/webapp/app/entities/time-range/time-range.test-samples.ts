import { ITimeRange, NewTimeRange } from './time-range.model';

export const sampleWithRequiredData: ITimeRange = {
  id: 9567,
};

export const sampleWithPartialData: ITimeRange = {
  id: 47621,
  rangeSize: 42037,
  duration: '9924',
  description: 'Market Junctions Reactive',
};

export const sampleWithFullData: ITimeRange = {
  id: 53389,
  name: 'Handmade',
  rangeSize: 19986,
  duration: '60870',
  description: 'Planner',
};

export const sampleWithNewData: NewTimeRange = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
