import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Selection, EMPTY_SELECTION, SelectionType } from '../models/selection.model';
import { cellKey } from '../models/table.model';

@Injectable({ providedIn: 'root' })
export class SelectionService {
  private sel$ = new BehaviorSubject<Selection>({
    ...EMPTY_SELECTION,
    cellKeys: new Set<string>(),
  });

  readonly selection$: Observable<Selection> = this.sel$.asObservable();

  get snapshot(): Selection {
    return this.sel$.value;
  }

  clear(): void {
    this.sel$.next({ type: 'none', cellKeys: new Set<string>(), anchorKey: null });
  }

  selectCell(rowId: string, colId: string, extend = false): void {
    const key = cellKey(rowId, colId);
    if (extend && this.snapshot.anchorKey) {
      const keys = new Set<string>(this.snapshot.cellKeys);
      keys.add(key);
      this.sel$.next({ type: 'cells', cellKeys: keys, anchorKey: this.snapshot.anchorKey });
    } else {
      this.sel$.next({
        type: 'cell',
        cellKeys: new Set<string>([key]),
        anchorKey: key,
      });
    }
  }

  selectRange(
    rowIds: string[],
    colIds: string[],
    anchorRowId: string,
    anchorColId: string,
  ): void {
    const keys = new Set<string>();
    rowIds.forEach((r: string) => colIds.forEach((c: string) => keys.add(cellKey(r, c))));
    this.sel$.next({
      type: keys.size === 1 ? 'cell' : 'cells',
      cellKeys: keys,
      anchorKey: cellKey(anchorRowId, anchorColId),
    });
  }

  selectRow(rowId: string, colIds: string[], extend = false): void {
    const keys = new Set<string>(colIds.map((c: string) => cellKey(rowId, c)));
    if (extend) {
      const merged = new Set<string>([...this.snapshot.cellKeys, ...keys]);
      this.sel$.next({
        type: 'rows',
        cellKeys: merged,
        anchorKey: this.snapshot.anchorKey,
      });
    } else {
      this.sel$.next({
        type: 'row',
        cellKeys: keys,
        anchorKey: cellKey(rowId, colIds[0]),
      });
    }
  }

  selectColumn(colId: string, rowIds: string[], extend = false): void {
    const keys = new Set<string>(rowIds.map((r: string) => cellKey(r, colId)));
    if (extend) {
      const merged = new Set<string>([...this.snapshot.cellKeys, ...keys]);
      this.sel$.next({
        type: 'columns',
        cellKeys: merged,
        anchorKey: this.snapshot.anchorKey,
      });
    } else {
      this.sel$.next({
        type: 'column',
        cellKeys: keys,
        anchorKey: cellKey(rowIds[0], colId),
      });
    }
  }

  selectAll(rowIds: string[], colIds: string[]): void {
    const keys = new Set<string>();
    rowIds.forEach((r: string) => colIds.forEach((c: string) => keys.add(cellKey(r, c))));
    this.sel$.next({ type: 'all', cellKeys: keys, anchorKey: null });
  }

  isSelected(rowId: string, colId: string): boolean {
    return this.snapshot.cellKeys.has(cellKey(rowId, colId));
  }

  getType(): SelectionType {
    return this.snapshot.type;
  }

  // After isSelected() method, add:
  isRowFullySelected(rowId: string, colIds: string[]): boolean {
    return colIds.every(c => this.snapshot.cellKeys.has(cellKey(rowId, c)));
  }

  isColumnFullySelected(colId: string, rowIds: string[]): boolean {
    return rowIds.every(r => this.snapshot.cellKeys.has(cellKey(r, colId)));
  }

  isAllSelected(rowIds: string[], colIds: string[]): boolean {
    return rowIds.every(r => colIds.every(c => this.snapshot.cellKeys.has(cellKey(r, c))));
  }

}
