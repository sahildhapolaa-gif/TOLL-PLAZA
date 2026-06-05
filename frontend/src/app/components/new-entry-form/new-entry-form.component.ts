import {
  Component,
  Output,
  EventEmitter,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TollService } from '../../services/toll.service';
import { TollLog, VehicleType } from '../../models/toll-log.model';

@Component({
  selector: 'app-new-entry-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card p-6 animate-slide-up">
      <div class="flex items-center gap-3 mb-6">
        <div class="w-8 h-8 rounded-lg bg-toll-accent/10 flex items-center justify-center">
          <span class="text-toll-accent text-lg">＋</span>
        </div>
        <div>
          <h2 class="font-display font-semibold text-toll-text text-base">New Vehicle Entry</h2>
          <p class="text-toll-muted text-xs font-body">Simulate a vehicle passing through</p>
        </div>
      </div>

      <div class="space-y-4">
        <div>
          <label class="block text-toll-textDim text-xs font-display uppercase tracking-widest mb-2">
            License Plate
          </label>
          <input
            type="text"
            class="input-field font-mono uppercase"
            placeholder="e.g. MH12AB1234"
            [(ngModel)]="licensePlate"
            (keyup.enter)="submit()"
            [disabled]="loading()"
          />
        </div>

        <div>
          <label class="block text-toll-textDim text-xs font-display uppercase tracking-widest mb-2">
            Vehicle Type
          </label>
           <div class="grid grid-cols-3 gap-3">
          <button
  *ngFor="let type of vehicleTypes"
  (click)="selectedType = type.value"
  [disabled]="loading()"
  class="py-2.5 rounded-lg border text-sm font-display transition-all duration-200 flex flex-col items-center gap-1"
  [class]="selectedType === type.value
    ? 'border-blue-500 bg-blue-50 text-blue-600'
    : 'border-toll-border bg-transparent text-toll-textDim hover:bg-blue-50 hover:border-blue-400 hover:text-blue-600'">
  <span class="text-xs">{{ type.label }}</span>
  <span class="text-xs font-mono opacity-70">{{ type.fee }}</span>
</button>
        </div>
       </div>
        <div class="flex items-center gap-3">
          <button
            (click)="isOfficial = !isOfficial"
            [disabled]="loading()"
            class="relative w-10 h-5 rounded-full transition-all duration-300 focus:outline-none"
            [class]="isOfficial ? 'bg-blue-500' : 'bg-gray-300'"
          >
            <span
              class="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-300 shadow"
              [class]="isOfficial ? 'left-5' : 'left-0.5'"
            ></span>
          </button>
 
          <div>
            <span class="text-toll-text text-sm font-body">Government / Official Vehicle</span>
            <span class="block text-toll-muted text-xs">Fee waived — $0.00</span>
          </div>
        </div><div *ngIf="!isOfficial">
  <label class="block text-toll-textDim text-xs font-display uppercase tracking-widest mb-2">
    Entry Status
  </label>

  <div class="grid grid-cols-3 gap-3">
    <button
      type="button"
      (click)="status='Paid'"
      [class]="status==='Paid'
        ? 'border-green-500 bg-green-50 text-green-600'
        : 'border-toll-border'"
      class="py-2 rounded-lg border text-sm">
      Paid
    </button>

    <button
      type="button"
      (click)="status='Pending'"
      [class]="status==='Pending'
        ? 'border-yellow-500 bg-yellow-50 text-yellow-600'
        : 'border-toll-border'"
      class="py-2 rounded-lg border text-sm">
      Pending
    </button>

    <button
      type="button"
      (click)="status='Violation'"
      [class]="status==='Violation'
        ? 'border-red-500 bg-red-50 text-red-600'
        : 'border-toll-border'"
      class="py-2 rounded-lg border text-sm">
      Violation
    </button>
  </div>
</div>
        <div class="bg-white rounded-lg px-4 py-3 flex items-center justify-between border border-gray-200 shadow-sm">
          <span class="text-toll-textDim text-xs font-display uppercase tracking-widest">Calculated Fee</span>
          <span class="font-display font-bold text-xl" [class]="isOfficial ? 'text-toll-blue' : 'text-toll-accent'">
            {{ isOfficial ? 'FREE' : feePreview }}
          </span>
        </div>

        <p *ngIf="error()" class="text-toll-red text-sm font-body bg-toll-red/5 border border-toll-red/20 rounded-lg px-3 py-2">
          ⚠ {{ error() }}
        </p>

        <button
          (click)="submit()"
          [disabled]="loading() || !licensePlate.trim()"
          class="btn-primary w-full"
        >
          <span *ngIf="!loading()">Log Vehicle Entry</span>
          <span *ngIf="loading()" class="flex items-center justify-center gap-2">
            <span class="w-3.5 h-3.5 border-2 border-toll-bg/30 border-t-toll-bg rounded-full animate-spin"></span>
            Processing...
          </span>
        </button>
      </div>
    </div>
  `,
})
export class NewEntryFormComponent {
  @Output() entryCreated = new EventEmitter<TollLog>();

  private tollService = inject(TollService);

  licensePlate = '';
  selectedType: VehicleType = 'Car';
  isOfficial = false;
  status: 'Paid' | 'Pending' | 'Violation' = 'Paid';
  loading = signal(false);
  error = signal('');

  vehicleTypes = [
    { value: 'Car' as VehicleType, label: 'Car', fee: '$5.00' },
    { value: 'Motorcycle' as VehicleType, label: 'Moto',  fee: '$2.00' },
    { value: 'Truck' as VehicleType, label: 'Truck', fee: '$10.00' },
  ];

  get feePreview(): string {
    const fees: Record<VehicleType, string> = {
      Car: '$5.00',
      Motorcycle: '$2.00',
      Truck: '$10.00',
    };
    return fees[this.selectedType];
  }

  submit(): void {
    const plate = this.licensePlate.trim().toUpperCase();
    if (!plate) {
      this.error.set('License plate is required.');
      return;
    }

    this.loading.set(true);
    this.error.set('');

   this.tollService.createLog({
  licensePlate: plate,
  vehicleType: this.selectedType,
  isOfficial: this.isOfficial,
  status: this.isOfficial ? 'Official' : this.status
})
      .subscribe({
        next: (log) => {
          this.entryCreated.emit(log);
          this.licensePlate = '';
          this.isOfficial = false;
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set(err?.error?.error ?? 'Failed to submit entry.');
          this.loading.set(false);
        },
      });
  }
}
