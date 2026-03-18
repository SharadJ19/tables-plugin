import {
  Component, Input, OnChanges, SimpleChanges,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Selection } from '../../../models/selection.model';

@Component({
  selector: 'app-selection-overlay',
  templateUrl: './selection-overlay.component.html',
  styleUrls: ['./selection-overlay.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectionOverlayComponent implements OnChanges {
  @Input() selection!: Selection;
  @Input() totalWidth = 0;
  @Input() totalHeight = 0;

  selectionSummary = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selection']) {
      const count = this.selection?.cellKeys.size ?? 0;
      this.selectionSummary = count > 1 ? `${count} cells selected` : '';
    }
  }
}
