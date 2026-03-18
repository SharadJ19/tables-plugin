import { Injectable } from '@angular/core';
import { TableState } from '../models/table.model';
import { HISTORY_LIMIT } from '../models/history.model';
import { deepClone } from '../shared/utils/id.util';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HistoryService {
  private past: TableState[] = [];
  private future: TableState[] = [];

  private canUndo$ = new BehaviorSubject<boolean>(false);
  private canRedo$ = new BehaviorSubject<boolean>(false);

  readonly canUndo = this.canUndo$.asObservable();
  readonly canRedo = this.canRedo$.asObservable();

  push(snapshot: TableState): void {
    this.past.push(deepClone(snapshot));
    if (this.past.length > HISTORY_LIMIT) {
      this.past.shift();
    }
    this.future = [];
    this.updateFlags();
  }

  undo(current: TableState): TableState | null {
    if (this.past.length === 0) return null;
    const prev = this.past.pop()!;
    this.future.unshift(deepClone(current));
    this.updateFlags();
    return prev;
  }

  redo(current: TableState): TableState | null {
    if (this.future.length === 0) return null;
    const next = this.future.shift()!;
    this.past.push(deepClone(current));
    this.updateFlags();
    return next;
  }

  clear(): void {
    this.past = [];
    this.future = [];
    this.updateFlags();
  }

  private updateFlags(): void {
    this.canUndo$.next(this.past.length > 0);
    this.canRedo$.next(this.future.length > 0);
  }
}
