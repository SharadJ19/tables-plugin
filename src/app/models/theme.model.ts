import { CellStyle } from './table.model';

export interface TableTheme {
  id: string;
  label: string;
  tableStyle: CellStyle;
  headerStyle?: Partial<CellStyle>;
  alternateRowStyle?: Partial<CellStyle>;
}
