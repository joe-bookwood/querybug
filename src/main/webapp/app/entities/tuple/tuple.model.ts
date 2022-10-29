import dayjs from 'dayjs/esm';
import { ICalculation } from 'app/entities/calculation/calculation.model';
import { IOhlc } from 'app/entities/ohlc/ohlc.model';

export interface ITuple {
  id: number;
  computation?: number | null;
  time?: dayjs.Dayjs | null;
  calculation?: Pick<ICalculation, 'id'> | null;
  ohlc?: Pick<IOhlc, 'id'> | null;
}

export type NewTuple = Omit<ITuple, 'id'> & { id: null };
