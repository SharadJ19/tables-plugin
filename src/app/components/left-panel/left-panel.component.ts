import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TableStateService } from '../../services/table-state.service';
import { TableState } from '../../models/table.model';

@Component({
  selector: 'app-left-panel',
  templateUrl: './left-panel.component.html',
  styleUrls: ['./left-panel.component.scss'],
})
export class LeftPanelComponent implements OnInit, OnDestroy {
  state!: TableState;
  structureExpanded = true;
  sizesExpanded = true;

  private destroy$ = new Subject<void>();

  constructor(private tableState: TableStateService) {}

  ngOnInit(): void {
    this.tableState.state
      .pipe(takeUntil(this.destroy$))
      .subscribe((s: TableState) => (this.state = s));
  }

  get rowCount(): number {
    return this.state.rows.length;
  }

  get colCount(): number {
    return this.state.columns.length;
  }

  addRow(): void {
    this.tableState.addRow();
  }

  addColumn(): void {
    this.tableState.addColumn();
  }

  deleteRow(rowId: string): void {
    this.tableState.deleteRow(rowId);
  }

  deleteColumn(colId: string): void {
    this.tableState.deleteColumn(colId);
  }

  onDefaultColWidthChange(value: string): void {
    const n = parseInt(value, 10);
    if (!isNaN(n)) this.tableState.setDefaultColWidth(n);
  }

  onDefaultRowHeightChange(value: string): void {
    const n = parseInt(value, 10);
    if (!isNaN(n)) this.tableState.setDefaultRowHeight(n);
  }

  applyUniformColWidth(): void {
    this.tableState.applyUniformColWidth();
  }

  applyUniformRowHeight(): void {
    this.tableState.applyUniformRowHeight();
  }

  toggleStructure(): void {
    this.structureExpanded = !this.structureExpanded;
  }

  toggleSizes(): void {
    this.sizesExpanded = !this.sizesExpanded;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
