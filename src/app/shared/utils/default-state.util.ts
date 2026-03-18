import { TableState, CellDef, ColumnDef, RowDef, cellKey } from '../../models/table.model';
import { generateId } from './id.util';
import { getDefaultTableStyle } from './style-resolver.util';

export function createDefaultState(): TableState {
  const cols = [
    { id: generateId('col'), width: 160 },
    { id: generateId('col'), width: 160 },
    { id: generateId('col'), width: 160 },
  ];
  const rows = [
    { id: generateId('row'), height: 40, isHeader: true },
    { id: generateId('row'), height: 36 },
    { id: generateId('row'), height: 36 },
    { id: generateId('row'), height: 36 },
    { id: generateId('row'), height: 36 },
  ];

  const cells: Record<string, CellDef> = {};
  const headerLabels = ['Column A', 'Column B', 'Column C'];

  rows.forEach((row: RowDef, ri: number) => {
    cols.forEach((col: ColumnDef, ci: number) => {
      const key = cellKey(row.id, col.id);
      cells[key] = {
        rowId: row.id,
        colId: col.id,
        content: ri === 0 ? headerLabels[ci] : '',
      };
    });
  });

  return {
    id: generateId('table'),
    columns: cols,
    rows,
    cells,
    tableStyle: getDefaultTableStyle(),
    defaultColWidth: 160,
    defaultRowHeight: 36,
    enablePluginMode: false,
    targetOrigin: '*',
  };
}
