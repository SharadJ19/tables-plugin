import { Injectable } from '@angular/core';
import { BehaviorSubject, debounceTime, Observable, Subject } from 'rxjs';
import {
  TableState,
  CellDef,
  CellStyle,
  ColumnDef,
  RowDef,
  cellKey,
} from '../models/table.model';
import { TableTheme } from '../models/theme.model';
import { HistoryService } from './history.service';
import { SelectionService } from './selection.service';
import { generateId, deepClone } from '../shared/utils/id.util';
import { createDefaultState } from '../shared/utils/default-state.util';

@Injectable({ providedIn: 'root' })
export class TableStateService {
  private state$ = new BehaviorSubject<TableState>(createDefaultState());

  readonly state: Observable<TableState> = this.state$.asObservable();

  // Debounce subjects for noisy operations
  private contentDebounce$ = new Subject<void>();
  private styleDebounce$ = new Subject<void>();
  
  constructor(
    private history: HistoryService,
    private selection: SelectionService,
  ) {

    // Capture history 300ms after user stops typing
    this.contentDebounce$
      .pipe(debounceTime(300))
      .subscribe(() => this.history.push(this.snapshot));

    // Capture history 200ms after user stops picking color/style
    this.styleDebounce$
      .pipe(debounceTime(200))
      .subscribe(() => this.history.push(this.snapshot));

  }

  get snapshot(): TableState {
    return this.state$.value;
  }

  private update(fn: (s: TableState) => TableState, recordHistory = true): void {
    if (recordHistory) {
      this.history.push(this.snapshot);
    }
    this.state$.next(fn(this.snapshot));
  }

  loadState(state: TableState): void {
    this.history.clear();
    this.selection.clear();
    this.state$.next(deepClone(state));
  }

  resetToDefault(): void {
    this.history.clear();
    this.selection.clear();
    this.state$.next(createDefaultState());
  }

  undo(): void {
    const prev = this.history.undo(this.snapshot);
    if (prev) {
      this.state$.next(prev);
      this.selection.clear();
    }
  }

  redo(): void {
    const next = this.history.redo(this.snapshot);
    if (next) {
      this.state$.next(next);
      this.selection.clear();
    }
  }

  updateCellContent(rowId: string, colId: string, content: string): void {
    // Update state immediately (no history push yet)
    this.state$.next(
      (() => {
        const s = this.snapshot;
        const key = cellKey(rowId, colId);
        const cells = { ...s.cells };
        cells[key] = { ...cells[key], content };
        return { ...s, cells };
      })()
    );
    // Debounce the history push
    this.contentDebounce$.next();
  }

  applyStyleToSelection(patch: Partial<CellStyle>): void {
    const keys = this.selection.snapshot.cellKeys;
    if (keys.size === 0) return;
    this.state$.next(
      (() => {
        const s = this.snapshot;
        const cells = { ...s.cells };
        keys.forEach((key: string) => {
          cells[key] = {
            ...cells[key],
            style: { ...(cells[key]?.style || {}), ...patch },
          };
        });
        return { ...s, cells };
      })()
    );
    this.styleDebounce$.next();
  }

 applyTableStyle(patch: Partial<CellStyle>): void {
    this.state$.next({ ...this.snapshot, tableStyle: { ...this.snapshot.tableStyle, ...patch } });
    this.styleDebounce$.next();
  }

  applyRowStyle(rowId: string, patch: Partial<CellStyle>): void {
    this.update((s: TableState) => {
      const rows = s.rows.map((r: RowDef) =>
        r.id === rowId ? { ...r, style: { ...(r.style || {}), ...patch } } : r,
      );
      return { ...s, rows };
    });
  }

  applyColumnStyle(colId: string, patch: Partial<CellStyle>): void {
    this.update((s: TableState) => {
      const columns = s.columns.map((c: ColumnDef) =>
        c.id === colId ? { ...c, style: { ...(c.style || {}), ...patch } } : c,
      );
      return { ...s, columns };
    });
  }

  clearCellStyle(rowId: string, colId: string): void {
    this.update((s: TableState) => {
      const cells = { ...s.cells };
      const key = cellKey(rowId, colId);
      if (cells[key]) {
        cells[key] = { ...cells[key], style: {} };
      }
      return { ...s, cells };
    });
  }

  addRow(afterRowId?: string): void {
    this.update((s: TableState) => {
      const newRow: RowDef = { id: generateId('row'), height: s.defaultRowHeight };
      let rows: RowDef[];
      if (afterRowId) {
        const idx = s.rows.findIndex((r: RowDef) => r.id === afterRowId);
        rows = [...s.rows.slice(0, idx + 1), newRow, ...s.rows.slice(idx + 1)];
      } else {
        rows = [...s.rows, newRow];
      }
      const cells = { ...s.cells };
      s.columns.forEach((col: ColumnDef) => {
        const key = cellKey(newRow.id, col.id);
        cells[key] = { rowId: newRow.id, colId: col.id, content: '' };
      });
      return { ...s, rows, cells };
    });
  }

  deleteRow(rowId: string): void {
    if (this.snapshot.rows.length <= 1) return;
    this.update((s: TableState) => {
      const rows = s.rows.filter((r: RowDef) => r.id !== rowId);
      const cells = { ...s.cells };
      s.columns.forEach((col: ColumnDef) => {
        delete cells[cellKey(rowId, col.id)];
      });
      return { ...s, rows, cells };
    });
    this.selection.clear();
  }

  setRowHeight(rowId: string, height: number): void {
    this.update((s: TableState) => ({
      ...s,
      rows: s.rows.map((r: RowDef) =>
        r.id === rowId ? { ...r, height: Math.max(24, height) } : r,
      ),
    }), false);
  }

  addColumn(afterColId?: string): void {
    this.update((s: TableState) => {
      const newCol: ColumnDef = { id: generateId('col'), width: s.defaultColWidth };
      let columns: ColumnDef[];
      if (afterColId) {
        const idx = s.columns.findIndex((c: ColumnDef) => c.id === afterColId);
        columns = [...s.columns.slice(0, idx + 1), newCol, ...s.columns.slice(idx + 1)];
      } else {
        columns = [...s.columns, newCol];
      }
      const cells = { ...s.cells };
      s.rows.forEach((row: RowDef) => {
        const key = cellKey(row.id, newCol.id);
        cells[key] = { rowId: row.id, colId: newCol.id, content: '' };
      });
      return { ...s, columns, cells };
    });
  }

  deleteColumn(colId: string): void {
    if (this.snapshot.columns.length <= 1) return;
    this.update((s: TableState) => {
      const columns = s.columns.filter((c: ColumnDef) => c.id !== colId);
      const cells = { ...s.cells };
      s.rows.forEach((row: RowDef) => {
        delete cells[cellKey(row.id, colId)];
      });
      return { ...s, columns, cells };
    });
    this.selection.clear();
  }

  setColumnWidth(colId: string, width: number): void {
    this.update((s: TableState) => ({
      ...s,
      columns: s.columns.map((c: ColumnDef) =>
        c.id === colId ? { ...c, width: Math.max(40, width) } : c,
      ),
    }), false);
  }

  commitColumnWidth(colId: string, width: number): void {
    this.history.push(this.snapshot);
    this.update((s: TableState) => ({
      ...s,
      columns: s.columns.map((c: ColumnDef) =>
        c.id === colId ? { ...c, width: Math.max(40, width) } : c,
      ),
    }), false);
  }

  commitRowHeight(rowId: string, height: number): void {
    this.history.push(this.snapshot);
    this.update((s: TableState) => ({
      ...s,
      rows: s.rows.map((r: RowDef) =>
        r.id === rowId ? { ...r, height: Math.max(24, height) } : r,
      ),
    }), false);
  }

  setDefaultColWidth(width: number): void {
    this.update((s: TableState) => ({ ...s, defaultColWidth: Math.max(40, width) }));
  }

  setDefaultRowHeight(height: number): void {
    this.update((s: TableState) => ({ ...s, defaultRowHeight: Math.max(24, height) }));
  }

  applyUniformColWidth(): void {
    this.update((s: TableState) => ({
      ...s,
      columns: s.columns.map((c: ColumnDef) => ({ ...c, width: s.defaultColWidth })),
    }));
  }

  applyUniformRowHeight(): void {
    this.update((s: TableState) => ({
      ...s,
      rows: s.rows.map((r: RowDef) => ({ ...r, height: s.defaultRowHeight })),
    }));
  }

  applyTheme(theme: TableTheme): void {
    this.update((s: TableState) => {
      let rows = s.rows;
      if (theme.headerStyle) {
        rows = s.rows.map((r: RowDef, i: number) =>
          i === 0
            ? { ...r, style: { ...(r.style || {}), ...theme.headerStyle } }
            : r,
        );
      }
      if (theme.alternateRowStyle) {
        rows = rows.map((r: RowDef, i: number) =>
          i > 0 && i % 2 === 0
            ? { ...r, style: { ...(r.style || {}), ...theme.alternateRowStyle } }
            : r,
        );
      }
      return { ...s, tableStyle: theme.tableStyle, rows };
    });
  }

  setSvgDataUrl(url: string): void {
    this.state$.next({ ...this.snapshot, svgDataUrl: url });
  }
}
