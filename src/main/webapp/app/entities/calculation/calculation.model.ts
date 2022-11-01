import dayjs from 'dayjs/esm';
import { IChart } from 'app/entities/chart/chart.model';

export interface ICalculation {
  id: number;
  name?: string | null;
  last?: dayjs.Dayjs | null;
  disabled?: boolean | null;
  chart?: Pick<IChart, 'id'> | null;
}

export type NewCalculation = Omit<ICalculation, 'id'> & { id: null };
