import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './Modal.component.html',
  styleUrls: ['./Modal.component.css'],
})
export class ModalComponent {
  @Input() isVisible: boolean = false;
  @Input() title: string = '';
  @Output() close = new EventEmitter<void>();

  closeModal() {
    this.isVisible = false;
    this.close.emit();
  }
}
