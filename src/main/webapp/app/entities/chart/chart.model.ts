import dayjs from 'dayjs/esm';
import { IPair } from 'app/entities/pair/pair.model';
import { ITimeRange } from 'app/entities/time-range/time-range.model';

export interface IChart {
  id: number;
  name?: string | null;
  last?: dayjs.Dayjs | null;
  maxCount?: number | null;
  disabled?: boolean | null;
  pair?: Pick<IPair, 'id'> | null;
  timeRange?: Pick<ITimeRange, 'id'> | null;
}

export type NewChart = Omit<IChart, 'id'> & { id: null };
