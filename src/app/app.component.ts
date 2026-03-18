import { Component, OnInit, HostListener } from '@angular/core';
import { TableStateService } from './services/table-state.service';
import { PluginBridgeService } from './services/plugin-bridge.service';
import { SelectionService } from './services/selection.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private tableState: TableStateService,
    private pluginBridge: PluginBridgeService,
    private selection: SelectionService,
  ) {}

  ngOnInit(): void {
    this.pluginBridge.init();
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(e: KeyboardEvent): void {
    const isMac = navigator.platform.toUpperCase().includes('MAC');
    const ctrl = isMac ? e.metaKey : e.ctrlKey;

    if (ctrl && e.key === 'z' && !e.shiftKey) {
      e.preventDefault();
      this.tableState.undo();
    } else if (ctrl && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
      e.preventDefault();
      this.tableState.redo();
    } else if (ctrl && e.key === 'a') {
      e.preventDefault();
      const s = this.tableState.snapshot;
      this.selection.selectAll(s.rows.map(r => r.id), s.columns.map(c => c.id));
    }
  }
}
