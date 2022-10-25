import { IPair } from 'app/entities/pair/pair.model';

export interface IFee {
  id: number;
  volume?: number | null;
  percent?: number | null;
  pair?: Pick<IPair, 'id'> | null;
}

export type NewFee = Omit<IFee, 'id'> & { id: null };
