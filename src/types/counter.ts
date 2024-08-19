export type Counter = {
  id: string;
  name: string;
  entries: CounterEntry[];
  createdAt: Date;
};

export type CounterEntry = {
  id: string;
  timestamp: Date;
};
