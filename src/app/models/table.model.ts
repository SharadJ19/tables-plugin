export interface CellStyle {
  bgColor: string;
  textColor: string;
  fontSize: number;
  fontWeight: 'normal' | 'bold';
  fontStyle: 'normal' | 'italic';
  textAlign: 'left' | 'center' | 'right';
  verticalAlign: 'top' | 'middle' | 'bottom';
  borderTop: string;
  borderRight: string;
  borderBottom: string;
  borderLeft: string;
  borderColor: string;
  paddingX: number;
  paddingY: number;
}

export interface ColumnDef {
  id: string;
  width: number;
  style?: Partial<CellStyle>;
}

export interface RowDef {
  id: string;
  height: number;
  style?: Partial<CellStyle>;
  isHeader?: boolean;
}

export interface CellDef {
  rowId: string;
  colId: string;
  content: string;
  style?: Partial<CellStyle>;
  colspan?: number;
  rowspan?: number;
}

export interface TableState {
  id: string;
  columns: ColumnDef[];
  rows: RowDef[];
  cells: Record<string, CellDef>;
  tableStyle: CellStyle;
  defaultColWidth: number;
  defaultRowHeight: number;
  svgDataUrl?: string;
  targetOrigin?: string;
  enablePluginMode?: boolean;
}

export const DEFAULT_CELL_STYLE: CellStyle = {
  bgColor: '#ffffff',
  textColor: '#1a1a1a',
  fontSize: 13,
  fontWeight: 'normal',
  fontStyle: 'normal',
  textAlign: 'left',
  verticalAlign: 'middle',
  borderTop: '1px solid',
  borderRight: '1px solid',
  borderBottom: '1px solid',
  borderLeft: '1px solid',
  borderColor: '#d1d5db',
  paddingX: 8,
  paddingY: 6,
};

export function cellKey(rowId: string, colId: string): string {
  return `${rowId}-${colId}`;
}
