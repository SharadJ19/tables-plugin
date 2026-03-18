import { TableTheme } from '../models/theme.model';
import { DEFAULT_CELL_STYLE } from '../models/table.model';

export const BUILT_IN_THEMES: TableTheme[] = [

  {
    id: 'minimal',
    label: 'Minimal',
    tableStyle: {
      ...DEFAULT_CELL_STYLE,
      bgColor: '#ffffff',
      textColor: '#1a1a1a',
      borderColor: '#e5e7eb',
      fontSize: 13,
    },
    headerStyle: {
      bgColor: '#f9fafb',
      textColor: '#111827',
      fontWeight: 'bold',
      borderColor: '#d1d5db',
    },
  },

  {
    id: 'modern-dark',
    label: 'Modern Dark',
    tableStyle: {
      ...DEFAULT_CELL_STYLE,
      bgColor: '#111827',
      textColor: '#e5e7eb',
      borderColor: '#374151',
      fontSize: 13,
    },
    headerStyle: {
      bgColor: '#000000',
      textColor: '#ffffff',
      fontWeight: 'bold',
      borderColor: '#000000',
    },
    alternateRowStyle: {
      bgColor: '#1f2937',
    },
  },

  {
    id: 'ocean',
    label: 'Ocean Blue',
    tableStyle: {
      ...DEFAULT_CELL_STYLE,
      bgColor: '#f0f9ff',
      textColor: '#0c4a6e',
      borderColor: '#bae6fd',
      fontSize: 13,
    },
    headerStyle: {
      bgColor: '#0284c7',
      textColor: '#ffffff',
      fontWeight: 'bold',
      borderColor: '#0284c7',
    },
    alternateRowStyle: {
      bgColor: '#e0f2fe',
    },
  },

  {
    id: 'emerald',
    label: 'Emerald Professional',
    tableStyle: {
      ...DEFAULT_CELL_STYLE,
      bgColor: '#f0fdf4',
      textColor: '#064e3b',
      borderColor: '#a7f3d0',
      fontSize: 13,
    },
    headerStyle: {
      bgColor: '#047857',
      textColor: '#ffffff',
      fontWeight: 'bold',
      borderColor: '#047857',
    },
    alternateRowStyle: {
      bgColor: '#dcfce7',
    },
  },

  {
    id: 'sunset',
    label: 'Sunset Orange',
    tableStyle: {
      ...DEFAULT_CELL_STYLE,
      bgColor: '#fff7ed',
      textColor: '#7c2d12',
      borderColor: '#fdba74',
      fontSize: 13,
    },
    headerStyle: {
      bgColor: '#ea580c',
      textColor: '#ffffff',
      fontWeight: 'bold',
      borderColor: '#ea580c',
    },
    alternateRowStyle: {
      bgColor: '#ffedd5',
    },
  },

  {
    id: 'royal',
    label: 'Royal Purple',
    tableStyle: {
      ...DEFAULT_CELL_STYLE,
      bgColor: '#faf5ff',
      textColor: '#3b0764',
      borderColor: '#e9d5ff',
      fontSize: 13,
    },
    headerStyle: {
      bgColor: '#6b21a8',
      textColor: '#ffffff',
      fontWeight: 'bold',
      borderColor: '#6b21a8',
    },
    alternateRowStyle: {
      bgColor: '#f3e8ff',
    },
  },

  {
    id: 'teal-modern',
    label: 'Modern Teal',
    tableStyle: {
      ...DEFAULT_CELL_STYLE,
      bgColor: '#ecfeff',
      textColor: '#083344',
      borderColor: '#99f6e4',
      fontSize: 13,
    },
    headerStyle: {
      bgColor: '#0f766e',
      textColor: '#ffffff',
      fontWeight: 'bold',
      borderColor: '#0f766e',
    },
    alternateRowStyle: {
      bgColor: '#cffafe',
    },
  },

  {
    id: 'rose',
    label: 'Rose Elegant',
    tableStyle: {
      ...DEFAULT_CELL_STYLE,
      bgColor: '#fff1f2',
      textColor: '#881337',
      borderColor: '#fecdd3',
      fontSize: 13,
    },
    headerStyle: {
      bgColor: '#be123c',
      textColor: '#ffffff',
      fontWeight: 'bold',
      borderColor: '#be123c',
    },
    alternateRowStyle: {
      bgColor: '#ffe4e6',
    },
  },

  {
    id: 'amber',
    label: 'Amber Bright',
    tableStyle: {
      ...DEFAULT_CELL_STYLE,
      bgColor: '#fffbeb',
      textColor: '#78350f',
      borderColor: '#fde68a',
      fontSize: 13,
    },
    headerStyle: {
      bgColor: '#d97706',
      textColor: '#ffffff',
      fontWeight: 'bold',
      borderColor: '#d97706',
    },
    alternateRowStyle: {
      bgColor: '#fef3c7',
    },
  },

  {
    id: 'indigo',
    label: 'Indigo Tech',
    tableStyle: {
      ...DEFAULT_CELL_STYLE,
      bgColor: '#eef2ff',
      textColor: '#1e1b4b',
      borderColor: '#c7d2fe',
      fontSize: 13,
    },
    headerStyle: {
      bgColor: '#4338ca',
      textColor: '#ffffff',
      fontWeight: 'bold',
      borderColor: '#4338ca',
    },
    alternateRowStyle: {
      bgColor: '#e0e7ff',
    },
  },

  {
    id: 'mint',
    label: 'Mint Fresh',
    tableStyle: {
      ...DEFAULT_CELL_STYLE,
      bgColor: '#f0fdfa',
      textColor: '#134e4a',
      borderColor: '#99f6e4',
      fontSize: 13,
    },
    headerStyle: {
      bgColor: '#14b8a6',
      textColor: '#ffffff',
      fontWeight: 'bold',
      borderColor: '#14b8a6',
    },
    alternateRowStyle: {
      bgColor: '#ccfbf1',
    },
  },

  {
    id: 'sky',
    label: 'Sky Light',
    tableStyle: {
      ...DEFAULT_CELL_STYLE,
      bgColor: '#f0f9ff',
      textColor: '#075985',
      borderColor: '#bae6fd',
      fontSize: 13,
    },
    headerStyle: {
      bgColor: '#0284c7',
      textColor: '#ffffff',
      fontWeight: 'bold',
      borderColor: '#0284c7',
    },
    alternateRowStyle: {
      bgColor: '#e0f2fe',
    },
  },

  {
    id: 'graphite',
    label: 'Graphite',
    tableStyle: {
      ...DEFAULT_CELL_STYLE,
      bgColor: '#f9fafb',
      textColor: '#111827',
      borderColor: '#9ca3af',
      fontSize: 13,
    },
    headerStyle: {
      bgColor: '#374151',
      textColor: '#ffffff',
      fontWeight: 'bold',
      borderColor: '#374151',
    },
    alternateRowStyle: {
      bgColor: '#f3f4f6',
    },
  },

  {
    id: 'coral',
    label: 'Coral Bright',
    tableStyle: {
      ...DEFAULT_CELL_STYLE,
      bgColor: '#fff1f2',
      textColor: '#7f1d1d',
      borderColor: '#fca5a5',
      fontSize: 13,
    },
    headerStyle: {
      bgColor: '#ef4444',
      textColor: '#ffffff',
      fontWeight: 'bold',
      borderColor: '#ef4444',
    },
    alternateRowStyle: {
      bgColor: '#fee2e2',
    },
  },

  {
    id: 'black-gold',
    label: 'Black Gold',
    tableStyle: {
      ...DEFAULT_CELL_STYLE,
      bgColor: '#111111',
      textColor: '#f3f4f6',
      borderColor: '#d4af37',
      fontSize: 13,
    },
    headerStyle: {
      bgColor: '#d4af37',
      textColor: '#111111',
      fontWeight: 'bold',
      borderColor: '#d4af37',
    },
    alternateRowStyle: {
      bgColor: '#1f1f1f',
    },
  },

];
