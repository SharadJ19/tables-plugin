import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AppComponent } from './app.component';

// Components
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { LeftPanelComponent } from './components/left-panel/left-panel.component';
import { RightPanelComponent } from './components/right-panel/right-panel.component';
import { TableCanvasComponent } from './components/table-canvas/table-canvas.component';
import { TableCellComponent } from './components/table-canvas/table-cell/table-cell.component';
import { ResizeHandleComponent } from './components/table-canvas/resize-handle/resize-handle.component';
import { SelectionOverlayComponent } from './components/table-canvas/selection-overlay/selection-overlay.component';

// Shared
import { AutoFocusDirective } from './shared/directives/auto-focus.directive';
import { ClickOutsideDirective } from './shared/directives/click-outside.directive';
import { TruncatePipe } from './shared/pipes/truncate.pipe';

@NgModule({
  declarations: [
    AppComponent,
    ToolbarComponent,
    LeftPanelComponent,
    RightPanelComponent,
    TableCanvasComponent,
    TableCellComponent,
    ResizeHandleComponent,
    SelectionOverlayComponent,
    AutoFocusDirective,
    ClickOutsideDirective,
    TruncatePipe,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
