export type SelectionType = 'none' | 'cell' | 'cells' | 'row' | 'rows' | 'column' | 'columns' | 'all';

export interface Selection {
  type: SelectionType;
  cellKeys: Set<string>;
  anchorKey: string | null;
}

export const EMPTY_SELECTION: Selection = {
  type: 'none',
  cellKeys: new Set(),
  anchorKey: null,
};
