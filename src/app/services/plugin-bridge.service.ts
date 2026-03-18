import { Injectable, OnDestroy } from '@angular/core';
import { TableStateService } from './table-state.service';
import { ExportService } from './export.service';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PluginBridgeService implements OnDestroy {
  private destroy$ = new Subject<void>();
  private messageHandler!: (e: MessageEvent) => void;

  constructor(
    private tableState: TableStateService,
    private exportService: ExportService,
  ) {}

  init(): void {
    // this.messageHandler = (event: MessageEvent) => {
    //   const data = event.data;
    //   if (!data) return;

    //   // Parent sends: { message: 'edit-layout-object', payload: <tableState> }
    //   if (data.message === 'edit-layout-object') {
    //     if (data.payload) {
    //       this.tableState.loadState(data.payload);
    //     }
    //   }
    // };

    // window.addEventListener('message', this.messageHandler);
  }

  addToProject(): void {
    const svgDataUrl = this.exportService.renderSVGDataUrl();
    const state = this.tableState.snapshot;

    window.parent.postMessage({
      type: 'ADD_OBJECT',
      payload: {
        dataString: svgDataUrl,
        type: 'imagebox',
        metaData: state,
      },
    }, '*');
  }

  ngOnDestroy(): void {
    if (this.messageHandler) {
      window.removeEventListener('message', this.messageHandler);
    }
    this.destroy$.next();
    this.destroy$.complete();
  }
}