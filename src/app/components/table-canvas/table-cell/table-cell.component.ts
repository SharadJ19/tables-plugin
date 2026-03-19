import {
  Component, Input, Output, EventEmitter,
  OnChanges, SimpleChanges, ViewChild, ElementRef,
  ChangeDetectionStrategy,
} from '@angular/core';

@Component({
  selector: 'app-table-cell',
  templateUrl: './table-cell.component.html',
  styleUrls: ['./table-cell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableCellComponent implements OnChanges {
  @Input() rowId!: string;
  @Input() colId!: string;
  @Input() content = '';
  @Input() isEditing = false;
  @Input() style: Record<string, string> = {};

  @Output() contentChange = new EventEmitter<string>();
  @Output() editDone = new EventEmitter<void>();

  
  @ViewChild('textarea') textareaRef?: ElementRef<HTMLTextAreaElement>;

  editValue = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isEditing']) {
      if (this.isEditing) {
        this.editValue = this.content;
        // Focus after view update
        setTimeout(() => {
          const ta = this.textareaRef?.nativeElement;
          if (ta) {
            ta.focus();
            // Place cursor at end
            const len = ta.value.length;
            ta.setSelectionRange(len, len);
            ta.scrollTop = ta.scrollHeight;
          }
        }, 0);
      }
    }
    if (changes['content'] && !this.isEditing) {
      this.editValue = this.content;
    }
  }

  onInput(event: Event): void {
    this.editValue = (event.target as HTMLTextAreaElement).value;
    this.contentChange.emit(this.editValue);
  }

onKeyDown(event: KeyboardEvent): void {
  if (event.key === 'Escape') {
    event.stopPropagation();
    this.editDone.emit();
  }

  // Shift+Enter = newline (let textarea handle it natively)
  if (event.key === 'Enter' && event.shiftKey) {
    event.stopPropagation(); // don't bubble to canvas
    // Let browser insert \n into textarea natively — do nothing else
    return;
  }

  if (['Enter', 'Tab', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
    event.stopPropagation();
    this.contentChange.emit(this.editValue);
    this.editDone.emit();
  }
}

  onBlur(): void {
    this.contentChange.emit(this.editValue);
    this.editDone.emit();
  }
}
