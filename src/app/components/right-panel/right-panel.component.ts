import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, combineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TableStateService } from '../../services/table-state.service';
import { SelectionService } from '../../services/selection.service';
import { TableState, CellStyle } from '../../models/table.model';
import { Selection, SelectionType } from '../../models/selection.model';
import { resolveStyle } from '../../shared/utils/style-resolver.util';

@Component({
  selector: 'app-right-panel',
  templateUrl: './right-panel.component.html',
  styleUrls: ['./right-panel.component.scss'],
})
export class RightPanelComponent implements OnInit, OnDestroy {
  state!: TableState;
  selection!: Selection;

  styleExpanded = true;
  borderExpanded = true;
  spacingExpanded = false;

  // Current resolved style for display in controls
  currentStyle!: CellStyle;

  private destroy$ = new Subject<void>();

  constructor(
    private tableState: TableStateService,
    private selectionService: SelectionService,
  ) {}

  ngOnInit(): void {
    combineLatest([this.tableState.state, this.selectionService.selection$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([state, sel]: [TableState, Selection]) => {
        this.state = state;
        this.selection = sel;
        this.resolveCurrentStyle();
      });
  }

  get selectionLabel(): string {
    const t = this.selection.type;
    const count = this.selection.cellKeys.size;
    if (t === 'none') return 'No selection';
    if (t === 'all') return 'All cells';
    if (t === 'cell') return '1 cell';
    return `${count} cells`;
  }

  get hasSelection(): boolean {
    return this.selection.type !== 'none';
  }

  private resolveCurrentStyle(): void {
    if (!this.state) return;
    if (this.selection.cellKeys.size === 0) {
      this.currentStyle = { ...this.state.tableStyle };
      return;
    }
    // Use first selected cell as preview
    const firstKey = [...this.selection.cellKeys][0];
    const [rowId, colId] = firstKey.split('-');
    this.currentStyle = resolveStyle(this.state, rowId, colId);
  }

  applyStyle(patch: Partial<CellStyle>): void {
    if (this.hasSelection) {
      this.tableState.applyStyleToSelection(patch);
    } else {
      this.tableState.applyTableStyle(patch);
    }
  }

  applyTableStyle(patch: Partial<CellStyle>): void {
    this.tableState.applyTableStyle(patch);
  }

  onBgColor(value: string): void { this.applyStyle({ bgColor: value }); }
  onTextColor(value: string): void { this.applyStyle({ textColor: value }); }
  onFontSize(value: string): void {
    const n = parseInt(value, 10);
    if (!isNaN(n)) this.applyStyle({ fontSize: n });
  }
  onFontWeight(value: 'normal' | 'bold'): void { this.applyStyle({ fontWeight: value }); }
  onFontStyle(value: 'normal' | 'italic'): void { this.applyStyle({ fontStyle: value }); }
  onTextAlign(value: 'left' | 'center' | 'right'): void { this.applyStyle({ textAlign: value }); }
  onVerticalAlign(value: 'top' | 'middle' | 'bottom'): void { this.applyStyle({ verticalAlign: value }); }
  onBorderColor(value: string): void { this.applyStyle({ borderColor: value }); }
  onBorderStyle(side: 'borderTop' | 'borderRight' | 'borderBottom' | 'borderLeft', value: string): void {
    this.applyStyle({ [side]: value });
  }
  onPaddingX(value: string): void {
    const n = parseInt(value, 10);
    if (!isNaN(n)) this.applyStyle({ paddingX: n });
  }
  onPaddingY(value: string): void {
    const n = parseInt(value, 10);
    if (!isNaN(n)) this.applyStyle({ paddingY: n });
  }

  onTableBgColor(value: string): void { this.applyTableStyle({ bgColor: value }); }
  onTableBorderColor(value: string): void { this.applyTableStyle({ borderColor: value }); }

  toggleStyle(): void { this.styleExpanded = !this.styleExpanded; }
  toggleBorder(): void { this.borderExpanded = !this.borderExpanded; }
  toggleSpacing(): void { this.spacingExpanded = !this.spacingExpanded; }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
