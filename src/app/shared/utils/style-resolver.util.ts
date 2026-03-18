import { TableState, CellStyle, ColumnDef, RowDef, DEFAULT_CELL_STYLE, cellKey } from '../../models/table.model';

export function resolveStyle(state: TableState, rowId: string, colId: string): CellStyle {
  const row = state.rows.find((r: RowDef) => r.id === rowId);
  const col = state.columns.find((c: ColumnDef) => c.id === colId);
  const cell = state.cells[cellKey(rowId, colId)];

  return {
    ...state.tableStyle,
    ...(row?.style || {}),
    ...(col?.style || {}),
    ...(cell?.style || {}),
  };
}

export function styleToCSS(style: CellStyle): Record<string, string> {
  return {
    'background-color': style.bgColor,
    'color': style.textColor,
    'font-size': `${style.fontSize}px`,
    'font-weight': style.fontWeight,
    'font-style': style.fontStyle,
    'text-align': style.textAlign,
    'vertical-align': style.verticalAlign,
    'padding': `${style.paddingY}px ${style.paddingX}px`,
    'border-top': `${style.borderTop} ${style.borderColor}`,
    'border-right': `${style.borderRight} ${style.borderColor}`,
    'border-bottom': `${style.borderBottom} ${style.borderColor}`,
    'border-left': `${style.borderLeft} ${style.borderColor}`,
  };
}

export function getDefaultTableStyle(): CellStyle {
  return { ...DEFAULT_CELL_STYLE };
}
