import {
  Component, Input, Output, EventEmitter,
  HostListener, ElementRef, OnDestroy,
  ChangeDetectionStrategy,
} from '@angular/core';

@Component({
  selector: 'app-resize-handle',
  templateUrl: './resize-handle.component.html',
  styleUrls: ['./resize-handle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResizeHandleComponent implements OnDestroy {
  @Input() orientation: 'vertical' | 'horizontal' = 'vertical';
  @Input() currentSize = 120;

  @Output() resizing = new EventEmitter<number>();
  @Output() resizeEnd = new EventEmitter<number>();

  isDragging = false;

  private startPos = 0;
  private startSize = 0;

  private mouseMoveHandler = this.onMouseMove.bind(this);
  private mouseUpHandler = this.onMouseUp.bind(this);

  constructor(private el: ElementRef) {}

  onMouseDown(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();

    this.isDragging = true;
    this.startSize = this.currentSize;
    this.startPos = this.orientation === 'vertical' ? event.clientX : event.clientY;

    document.addEventListener('mousemove', this.mouseMoveHandler);
    document.addEventListener('mouseup', this.mouseUpHandler);
    document.body.style.cursor = this.orientation === 'vertical' ? 'col-resize' : 'row-resize';
    document.body.style.userSelect = 'none';
  }

  private onMouseMove(event: MouseEvent): void {
    if (!this.isDragging) return;
    const delta = this.orientation === 'vertical'
      ? event.clientX - this.startPos
      : event.clientY - this.startPos;

    const newSize = Math.max(this.orientation === 'vertical' ? 40 : 24, this.startSize + delta);
    this.resizing.emit(newSize);
  }

  private onMouseUp(event: MouseEvent): void {
    if (!this.isDragging) return;
    this.isDragging = false;

    const delta = this.orientation === 'vertical'
      ? event.clientX - this.startPos
      : event.clientY - this.startPos;

    const newSize = Math.max(this.orientation === 'vertical' ? 40 : 24, this.startSize + delta);
    this.resizeEnd.emit(newSize);

    document.removeEventListener('mousemove', this.mouseMoveHandler);
    document.removeEventListener('mouseup', this.mouseUpHandler);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }

  ngOnDestroy(): void {
    document.removeEventListener('mousemove', this.mouseMoveHandler);
    document.removeEventListener('mouseup', this.mouseUpHandler);
  }
}
