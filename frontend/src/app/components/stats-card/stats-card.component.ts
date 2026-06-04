import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stats-card',
  standalone: true,
  imports: [CommonModule],
  template: `
   <div class="card w-full p-3 flex flex-col gap-2 animate-fade-in relative overflow-hidden">
      <div
        class="absolute top-0 left-0 w-full h-0.5"
        [class]="accentBar"
      ></div>

      <div class="flex items-center justify-between">
        <span class="text-toll-textDim text-xs font-display uppercase tracking-widest">{{ label }}</span>
        <span class="text-2xl">{{ icon }}</span>
      </div>

      <div class="flex items-end gap-2">
        <span class="font-display font-bold text-2xl" [class]="valueClass">
          {{ displayValue }}
        </span>
        <span *ngIf="subtext" class="text-toll-muted text-xs mb-0.5 font-body">{{ subtext }}</span>
      </div>
    </div>
  `,
})
export class StatsCardComponent {
  @Input() label = '';
  @Input() value: number = 0;
  @Input() icon = '';
  @Input() format: 'number' | 'currency' = 'number';
  @Input() valueClass = 'text-toll-text';
  @Input() accentBar = 'bg-gray-300';
  @Input() subtext = '';

  get displayValue(): string {
    if (this.format === 'currency') {
      return `$${this.value.toFixed(2)}`;
    }
    return String(this.value);
  }
}
