import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TableStateService } from '../../services/table-state.service';
import { ExportService } from '../../services/export.service';
import { HistoryService } from '../../services/history.service';
import { BUILT_IN_THEMES } from '../../themes/themes';
import { TableTheme } from '../../models/theme.model';
import { PluginBridgeService } from '../../services/plugin-bridge.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit, OnDestroy {
  canUndo = false;
  canRedo = false;
  showExportMenu = false;
  showThemeMenu = false;
  themes: TableTheme[] = BUILT_IN_THEMES;

  private destroy$ = new Subject<void>();

  constructor(
    private tableState: TableStateService,
    private exportService: ExportService,
    private history: HistoryService,
    private pluginBridge: PluginBridgeService,
  ) {}

  ngOnInit(): void {
    this.history.canUndo
      .pipe(takeUntil(this.destroy$))
      .subscribe((v: boolean) => (this.canUndo = v));

    this.history.canRedo
      .pipe(takeUntil(this.destroy$))
      .subscribe((v: boolean) => (this.canRedo = v));
  }

  undo(): void {
    this.tableState.undo();
  }

  redo(): void {
    this.tableState.redo();
  }

  addRow(): void {
    this.tableState.addRow();
  }

  addColumn(): void {
    this.tableState.addColumn();
  }

  applyTheme(theme: TableTheme): void {
    this.tableState.applyTheme(theme);
    this.showThemeMenu = false;
  }

  exportSVG(): void {
    this.exportService.downloadSVG();
    this.showExportMenu = false;
  }

  exportPNG(): void {
    this.exportService.downloadPNG();
    this.showExportMenu = false;
  }

  exportJPEG(): void {
    this.exportService.downloadJPEG();
    this.showExportMenu = false;
  }

  exportJSON(): void {
    this.exportService.downloadJSON();
    this.showExportMenu = false;
  }

  importJSON(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    this.exportService.importJSON(file).catch(err => alert(err.message));
    input.value = '';
  }

  resetTable(): void {
    if (confirm('Reset table to default? This will clear all content.')) {
      this.tableState.resetToDefault();
    }
  }

  closeMenus(): void {
    this.showExportMenu = false;
    this.showThemeMenu = false;
  }

  addToProject(): void {
    this.pluginBridge.addToProject();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
