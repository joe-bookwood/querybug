import dayjs from 'dayjs/esm';
import { ICalculation } from 'app/entities/calculation/calculation.model';
import { IOhlc } from 'app/entities/ohlc/ohlc.model';

export interface ITouple {
  id: number;
  computation?: number | null;
  time?: dayjs.Dayjs | null;
  calculation?: Pick<ICalculation, 'id'> | null;
  ohlc?: Pick<IOhlc, 'id'> | null;
}

export type NewTouple = Omit<ITouple, 'id'> & { id: null };
