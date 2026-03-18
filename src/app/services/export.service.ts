import { Injectable } from '@angular/core';
import { TableStateService } from './table-state.service';
import { TableState, ColumnDef, RowDef, cellKey } from '../models/table.model';
import { resolveStyle } from '../shared/utils/style-resolver.util';

@Injectable({ providedIn: 'root' })
export class ExportService {
  constructor(private tableState: TableStateService) {}

  renderSVGString(state?: TableState): string {
    const s = state || this.tableState.snapshot;
    const totalWidth = s.columns.reduce(
      (a: number, c: ColumnDef) => a + c.width,
      0,
    );
    const totalHeight = s.rows.reduce(
      (a: number, r: RowDef) => a + r.height,
      0,
    );

    const parts: string[] = [];
    parts.push(
      `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="${totalHeight}" ` +
        `viewBox="0 0 ${totalWidth} ${totalHeight}">`,
    );

    let y = 0;
    s.rows.forEach((row: RowDef) => {
      let x = 0;
      s.columns.forEach((col: ColumnDef) => {
        const style = resolveStyle(s, row.id, col.id);
        const cell = s.cells[cellKey(row.id, col.id)];
        const content = cell?.content || '';
        const w = col.width;
        const h = row.height;

        const textY =
          style.verticalAlign === 'top'
            ? y + style.paddingY + style.fontSize
            : style.verticalAlign === 'bottom'
              ? y + h - style.paddingY
              : y + h / 2 + style.fontSize * 0.35;

        const textAnchor =
          style.textAlign === 'center'
            ? 'middle'
            : style.textAlign === 'right'
              ? 'end'
              : 'start';

        const textX =
          style.textAlign === 'center'
            ? x + w / 2
            : style.textAlign === 'right'
              ? x + w - style.paddingX
              : x + style.paddingX;

        parts.push(
          `<rect x="${x}" y="${y}" width="${w}" height="${h}" ` +
            `fill="${style.bgColor}" stroke="${style.borderColor}" stroke-width="0.5"/>`,
        );

        if (content) {
          const lines = content.split('\n');
          const lineHeight = style.fontSize * 1.4;

          const firstLineY =
            style.verticalAlign === 'top'
              ? y + style.paddingY + style.fontSize
              : style.verticalAlign === 'bottom'
                ? y + h - style.paddingY - (lines.length - 1) * lineHeight
                : y +
                  h / 2 -
                  ((lines.length - 1) * lineHeight) / 2 +
                  style.fontSize * 0.35;

          const tspans = lines
            .map((line: string, i: number) => {
              const escaped = line
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');
              return `<tspan x="${textX}" dy="${i === 0 ? 0 : lineHeight}">${escaped}</tspan>`;
            })
            .join('');

          parts.push(
            `<text x="${textX}" y="${firstLineY}" font-family="sans-serif" ` +
              `font-size="${style.fontSize}" fill="${style.textColor}" ` +
              `text-anchor="${textAnchor}" font-weight="${style.fontWeight}" ` +
              `font-style="${style.fontStyle}">${tspans}</text>`,
          );
        }

        x += w;
      });
      y += row.height;
    });

    parts.push('</svg>');
    return parts.join('\n');
  }

  renderSVGDataUrl(state?: TableState): string {
    const svg = this.renderSVGString(state);
    const encoded = btoa(unescape(encodeURIComponent(svg)));
    return `data:image/svg+xml;base64,${encoded}`;
  }

  downloadSVG(): void {
    const svg = this.renderSVGString();
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    this.triggerDownload(blob, 'table.svg');
  }

  downloadPNG(scale = 2): void {
    this.renderToCanvas(scale).then((canvas: HTMLCanvasElement) => {
      canvas.toBlob((blob: Blob | null) => {
        if (blob) this.triggerDownload(blob, 'table.png');
      }, 'image/png');
    });
  }

  downloadJPEG(scale = 2): void {
    this.renderToCanvas(scale, '#ffffff').then((canvas: HTMLCanvasElement) => {
      canvas.toBlob(
        (blob: Blob | null) => {
          if (blob) this.triggerDownload(blob, 'table.jpg');
        },
        'image/jpeg',
        0.95,
      );
    });
  }

  downloadJSON(): void {
    const svgDataUrl = this.renderSVGDataUrl();
    this.tableState.setSvgDataUrl(svgDataUrl);
    const json = JSON.stringify(this.tableState.snapshot, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    this.triggerDownload(blob, 'table-state.json');
  }

  importJSON(file: File): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        try {
          const state = JSON.parse(e.target?.result as string) as TableState;
          this.validateState(state);
          this.tableState.loadState(state);
          resolve();
        } catch (err) {
          reject(new Error('Invalid table state file'));
        }
      };
      reader.onerror = () => reject(new Error('File read error'));
      reader.readAsText(file);
    });
  }

  private renderToCanvas(
    scale = 2,
    bgColor?: string,
  ): Promise<HTMLCanvasElement> {
    return new Promise<HTMLCanvasElement>((resolve, reject) => {
      const s = this.tableState.snapshot;
      const totalWidth = s.columns.reduce(
        (a: number, c: ColumnDef) => a + c.width,
        0,
      );
      const totalHeight = s.rows.reduce(
        (a: number, r: RowDef) => a + r.height,
        0,
      );

      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = totalWidth * scale;
        canvas.height = totalHeight * scale;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context unavailable'));
          return;
        }
        if (bgColor) {
          ctx.fillStyle = bgColor;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        ctx.scale(scale, scale);
        ctx.drawImage(img, 0, 0);
        resolve(canvas);
      };
      img.onerror = () => reject(new Error('SVG render failed'));
      img.src = this.renderSVGDataUrl();
    });
  }

  private triggerDownload(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  private validateState(state: TableState): void {
    if (
      !state.id ||
      !Array.isArray(state.columns) ||
      !Array.isArray(state.rows) ||
      !state.cells
    ) {
      throw new Error('Invalid state shape');
    }
  }
}
