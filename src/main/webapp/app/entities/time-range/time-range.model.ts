export interface ITimeRange {
  id: number;
  name?: string | null;
  rangeSize?: number | null;
  duration?: string | null;
  description?: string | null;
}

export type NewTimeRange = Omit<ITimeRange, 'id'> & { id: null };
