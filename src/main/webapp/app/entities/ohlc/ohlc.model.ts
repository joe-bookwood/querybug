import dayjs from 'dayjs/esm';
import { IChart } from 'app/entities/chart/chart.model';

export interface IOhlc {
  id: number;
  time?: dayjs.Dayjs | null;
  open?: number | null;
  high?: number | null;
  low?: number | null;
  close?: number | null;
  volumeWeightedAveragePrice?: number | null;
  volume?: number | null;
  count?: number | null;
  chart?: Pick<IChart, 'id'> | null;
}

export type NewOhlc = Omit<IOhlc, 'id'> & { id: null };
