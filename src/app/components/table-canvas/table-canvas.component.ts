import {
  Component,
  OnInit,
  OnDestroy,
  HostListener,
  ElementRef,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TableStateService } from '../../services/table-state.service';
import { SelectionService } from '../../services/selection.service';
import { TableState, ColumnDef, RowDef, cellKey } from '../../models/table.model';
import { Selection } from '../../models/selection.model';
import { resolveStyle, styleToCSS } from '../../shared/utils/style-resolver.util';

interface FocusedCell {
  rowId: string;
  colId: string;
}

@Component({
  selector: 'app-table-canvas',
  templateUrl: './table-canvas.component.html',
  styleUrls: ['./table-canvas.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableCanvasComponent implements OnInit, OnDestroy {
  state!: TableState;
  selection!: Selection;

  focusedCell: FocusedCell | null = null;
  editingCell: FocusedCell | null = null;

  private dragStart: FocusedCell | null = null;
  private isDragging = false;
  private destroy$ = new Subject<void>();

  constructor(
    private tableState: TableStateService,
    private selectionService: SelectionService,
    private cdr: ChangeDetectorRef,
    private el: ElementRef,
  ) {}

  ngOnInit(): void {
    this.tableState.state
      .pipe(takeUntil(this.destroy$))
      .subscribe((s: TableState) => {
        this.state = s;
        this.cdr.markForCheck();
      });

    this.selectionService.selection$
      .pipe(takeUntil(this.destroy$))
      .subscribe((sel: Selection) => {
        this.selection = sel;
        this.cdr.markForCheck();
      });
  }

  getCellStyles(rowId: string, colId: string): Record<string, string> {
    if (!this.state) return {};
    return styleToCSS(resolveStyle(this.state, rowId, colId));
  }

  isSelected(rowId: string, colId: string): boolean {
    return this.selection?.cellKeys.has(cellKey(rowId, colId)) ?? false;
  }

  isFocused(rowId: string, colId: string): boolean {
    return (
      this.focusedCell?.rowId === rowId && this.focusedCell?.colId === colId
    );
  }

  isEditing(rowId: string, colId: string): boolean {
    return (
      this.editingCell?.rowId === rowId && this.editingCell?.colId === colId
    );
  }

  getColWidth(colId: string): number {
    return this.state.columns.find((c: ColumnDef) => c.id === colId)?.width ?? 120;
  }

  getRowHeight(rowId: string): number {
    return this.state.rows.find((r: RowDef) => r.id === rowId)?.height ?? 36;
  }

  onCellMouseDown(event: MouseEvent, rowId: string, colId: string): void {
    if (event.button !== 0) return;
    event.stopPropagation();

    if (
      this.editingCell &&
      (this.editingCell.rowId !== rowId || this.editingCell.colId !== colId)
    ) {
      this.exitEdit();
    }

    this.dragStart = { rowId, colId };
    this.isDragging = false;

    if (event.shiftKey && this.selectionService.snapshot.anchorKey) {
      this.extendSelection(rowId, colId);
    } else {
      this.focusedCell = { rowId, colId };
      this.selectionService.selectCell(rowId, colId);
    }
    this.cdr.markForCheck();
  }

  onCellMouseEnter(rowId: string, colId: string): void {
    if (!this.dragStart) return;
    this.isDragging = true;
    this.dragSelectTo(rowId, colId);
  }

  @HostListener('document:mouseup')
  onMouseUp(): void {
    this.dragStart = null;
    this.isDragging = false;
  }

  private dragSelectTo(rowId: string, colId: string): void {
    if (!this.dragStart) return;
    const anchorRow = this.dragStart.rowId;
    const anchorCol = this.dragStart.colId;
    const rowIds = this.rowsBetween(anchorRow, rowId);
    const colIds = this.colsBetween(anchorCol, colId);
    this.selectionService.selectRange(rowIds, colIds, anchorRow, anchorCol);
    this.cdr.markForCheck();
  }

  private extendSelection(rowId: string, colId: string): void {
    const anchorKey = this.selectionService.snapshot.anchorKey;
    if (!anchorKey) return;
    const dashIdx = anchorKey.indexOf('-');
    const anchorRow = anchorKey.substring(0, dashIdx);
    const anchorCol = anchorKey.substring(dashIdx + 1);
    const rowIds = this.rowsBetween(anchorRow, rowId);
    const colIds = this.colsBetween(anchorCol, colId);
    this.selectionService.selectRange(rowIds, colIds, anchorRow, anchorCol);
  }

  onRowHeaderClick(event: MouseEvent, rowId: string): void {
    this.exitEdit();
    this.selectionService.selectRow(
      rowId,
      this.state.columns.map((c: ColumnDef) => c.id),
      event.shiftKey,
    );
    this.cdr.markForCheck();
  }

  onColHeaderClick(event: MouseEvent, colId: string): void {
    this.exitEdit();
    this.selectionService.selectColumn(
      colId,
      this.state.rows.map((r: RowDef) => r.id),
      event.shiftKey,
    );
    this.cdr.markForCheck();
  }

  onSelectAll(): void {
    this.exitEdit();
    this.selectionService.selectAll(
      this.state.rows.map((r: RowDef) => r.id),
      this.state.columns.map((c: ColumnDef) => c.id),
    );
    this.cdr.markForCheck();
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (!this.focusedCell) return;
    const { rowId, colId } = this.focusedCell;

    switch (event.key) {
      case 'Enter':
        event.preventDefault();
        if (this.editingCell) {
          this.exitEdit();
          this.moveSelection('down');
        } else {
          this.enterEdit(rowId, colId);
        }
        break;

      case 'Escape':
        if (this.editingCell) {
          this.exitEdit();
        } else {
          this.selectionService.clear();
          this.focusedCell = null;
        }
        break;

      case 'Tab':
        event.preventDefault();
        this.exitEdit();
        if (event.shiftKey) {
          this.moveSelection('left');
        } else {
          this.moveSelection('right');
        }
        if (this.focusedCell) {
          this.enterEdit(this.focusedCell.rowId, this.focusedCell.colId);
        }
        break;

      case 'ArrowUp':
        event.preventDefault();
        if (this.editingCell) { this.exitEdit(); }
        this.moveSelection('up');
        break;

      case 'ArrowDown':
        event.preventDefault();
        if (this.editingCell) { this.exitEdit(); }
        this.moveSelection('down');
        break;

      case 'ArrowLeft':
        if (!this.editingCell) { event.preventDefault(); this.moveSelection('left'); }
        break;

      case 'ArrowRight':
        if (!this.editingCell) { event.preventDefault(); this.moveSelection('right'); }
        break;

      case 'Delete':
      case 'Backspace':
        if (!this.editingCell && this.selection.cellKeys.size > 0) {
          event.preventDefault();
          this.clearSelectedCells();
        }
        break;

      default:
        if (
          !this.editingCell &&
          event.key.length === 1 &&
          !event.ctrlKey &&
          !event.metaKey
        ) {
          this.enterEdit(rowId, colId, true);
        }
    }
    this.cdr.markForCheck();
  }

  private moveSelection(dir: 'up' | 'down' | 'left' | 'right'): void {
    if (!this.focusedCell) return;
    const rows = this.state.rows;
    const cols = this.state.columns;
    const ri = rows.findIndex((r: RowDef) => r.id === this.focusedCell!.rowId);
    const ci = cols.findIndex((c: ColumnDef) => c.id === this.focusedCell!.colId);

    let nr = ri;
    let nc = ci;
    if (dir === 'up') nr = Math.max(0, ri - 1);
    if (dir === 'down') nr = Math.min(rows.length - 1, ri + 1);
    if (dir === 'left') nc = Math.max(0, ci - 1);
    if (dir === 'right') nc = Math.min(cols.length - 1, ci + 1);

    const newRow = rows[nr];
    const newCol = cols[nc];
    this.focusedCell = { rowId: newRow.id, colId: newCol.id };
    this.selectionService.selectCell(newRow.id, newCol.id);
  }

  private enterEdit(rowId: string, colId: string, clearContent = false): void {
    this.editingCell = { rowId, colId };
    if (clearContent) {
      this.tableState.updateCellContent(rowId, colId, '');
    }
  }

  exitEdit(): void {
    this.editingCell = null;
  }

  onCellDoubleClick(rowId: string, colId: string): void {
    this.focusedCell = { rowId, colId };
    this.selectionService.selectCell(rowId, colId);
    this.enterEdit(rowId, colId);
    this.cdr.markForCheck();
  }

  onCellContentChange(rowId: string, colId: string, content: string): void {
    this.tableState.updateCellContent(rowId, colId, content);
  }

  private clearSelectedCells(): void {
    this.selection.cellKeys.forEach((key: string) => {
      const dashIdx = key.indexOf('-');
      const rowId = key.substring(0, dashIdx);
      const colId = key.substring(dashIdx + 1);
      this.tableState.updateCellContent(rowId, colId, '');
    });
  }

  onColResizing(colId: string, width: number): void {
    this.tableState.setColumnWidth(colId, width);
  }

  onColResizeEnd(colId: string, width: number): void {
    this.tableState.commitColumnWidth(colId, width);
  }

  onRowResizing(rowId: string, height: number): void {
    this.tableState.setRowHeight(rowId, height);
  }

  onRowResizeEnd(rowId: string, height: number): void {
    this.tableState.commitRowHeight(rowId, height);
  }

  private rowsBetween(r1: string, r2: string): string[] {
    const rows = this.state.rows;
    const i1 = rows.findIndex((r: RowDef) => r.id === r1);
    const i2 = rows.findIndex((r: RowDef) => r.id === r2);
    const from = Math.min(i1, i2);
    const to = Math.max(i1, i2);
    return rows.slice(from, to + 1).map((r: RowDef) => r.id);
  }

  private colsBetween(c1: string, c2: string): string[] {
    const cols = this.state.columns;
    const i1 = cols.findIndex((c: ColumnDef) => c.id === c1);
    const i2 = cols.findIndex((c: ColumnDef) => c.id === c2);
    const from = Math.min(i1, i2);
    const to = Math.max(i1, i2);
    return cols.slice(from, to + 1).map((c: ColumnDef) => c.id);
  }

  trackById(_: number, item: { id: string }): string {
    return item.id;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
