import { TableState } from './table.model';

export interface HistoryEntry {
  state: TableState;
  timestamp: number;
}

export const HISTORY_LIMIT = 50;
