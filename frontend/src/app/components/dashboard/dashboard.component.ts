import {Component,OnInit,inject,signal,computed,} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TollService } from '../../services/toll.service';
import { TollLog, VehicleType, LogStatus } from '../../models/toll-log.model';
import { TollCurrencyPipe } from '../../pipes/toll-currency.pipe';
import { StatsCardComponent } from '../stats-card/stats-card.component';

@Component({
  selector: 'app-dashboard',
  standalone: true, 
  imports: [CommonModule, FormsModule, TollCurrencyPipe, StatsCardComponent],
  template: `
    <div class="p-6 space-y-6 animate-fade-in">
    <div class="grid grid-cols-6 gap-4">
      
  <app-stats-card
    label="Total Vehicles"
    [value]="stats().total"
    accentBar="bg-blue-500"
    valueClass="text-gray-900"
  />
  <app-stats-card 
  label="Official Vehicles"
    [value]="stats().official"
    accentBar="bg-blue-500"
    valueClass="text-gray-900"
   />

  <app-stats-card
    label="Paid"
    [value]="stats().paid"
    accentBar="bg-green-500"
    valueClass="text-green-600"
  />

  <app-stats-card
    label="Pending"
    [value]="stats().pending"
    accentBar="bg-yellow-500"
    valueClass="text-yellow-600"
  />

  <app-stats-card
    label="Violations"
    [value]="stats().violations"
    accentBar="bg-red-500"
    valueClass="text-red-600"
  />

  <app-stats-card
    label="Revenue"
    [value]="stats().totalRevenue"
    format="currency"
    accentBar="bg-black"
    valueClass="text-gray-900"
    class="col-span-2 lg:col-span-1"
  />
</div>
      <div class="card p-4">
        <div class="flex flex-col sm:flex-row gap-3">
          <div class="relative flex-1">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-toll-muted text-sm">🔍︎</span>
            <input
              type="text"
              class="input-field pl-9"
              placeholder="Search by license plate..."
              [(ngModel)]="searchQuery"
            />
          </div>
          <div class="relative sm:w-44">
            <select
              class="select-field pr-8"
              [(ngModel)]="vehicleFilter"
            >
              <option value="">All Vehicles</option>
              <option value="Car">Car</option>
              <option value="Motorcycle">Motorcycle</option>
              <option value="Truck">Truck</option>
            </select>
            <span class="absolute right-3 top-1/2 -translate-y-1/2 text-toll-muted text-xs pointer-events-none">▾</span>
          </div>
          <div class="relative sm:w-40">
            <select
              class="select-field pr-8"
              [(ngModel)]="statusFilter"
            >
              <option value="">All Status</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Violation">Violation</option>
              <option value="Official">Official</option>
            </select>
            <span class="absolute right-3 top-1/2 -translate-y-1/2 text-toll-muted text-xs pointer-events-none">▾</span>
          </div>
          <button (click)="loadLogs()" class="btn-ghost flex items-center gap-2 shrink-0">
            <span [class]="refreshing() ? 'animate-spin' : ''">↻</span>
            Refresh
          </button>
        </div>
        <div *ngIf="activeFilterCount > 0"
         class="mt-2 flex items-center gap-2">
          <span 
          class="text-toll-muted text-xs">
          {{ filteredLogs().length }} of {{ logs().length }} entries
        </span>
          <button (click)="clearFilters()" 
          class="text-toll-accent text-xs hover:underline">
          Clear filters
        </button>
        </div>
      </div>
      <div class="card overflow-hidden">
        <div class="border-b border-toll-border px-6 py-4 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="w-1.5 h-1.5 rounded-full bg-toll-green animate-pulse-dot"></div>
            <h2 class="font-display font-semibold text-toll-text text-sm uppercase tracking-wider">
              Vehicle Log
            </h2>
          </div>
          <span
           class="text-toll-muted text-xs font-mono">
            {{ filteredLogs().length }} records
          </span>
        </div>
        <div *ngIf="loading()" class="flex items-center justify-center py-16">
          <div class="flex flex-col items-center gap-3">
            <div class="w-8 h-8 border-2 border-toll-border border-t-toll-accent rounded-full animate-spin"></div>
            <span class="text-toll-muted text-sm font-body">Loading records...</span>
          </div>
        </div>
        <div *ngIf="loadError() && !loading()" class="flex items-center justify-center py-16">
          <div class="text-center">
            <div class="text-3xl mb-2"></div>
            <p class="text-toll-red font-body text-sm">{{ loadError() }}</p>
            <button (click)="loadLogs()" class="btn-ghost mt-3 mx-auto">Try Again</button>
          </div>
        </div>
        <div *ngIf="!loading() && !loadError() && filteredLogs().length === 0" 
        class="flex items-center justify-center py-16">
          <div class="text-center">
            <div class="text-4xl mb-3"></div>
            <p class="text-toll-textDim font-display text-sm">No vehicles found</p>
            <p class="text-toll-muted text-xs mt-1 font-body">
              {{ activeFilterCount > 0 ? 'Try adjusting your filters.' : 'Waiting for vehicles to pass through.' }}
            </p>
          </div>
        </div>
        <div *ngIf="!loading() && !loadError() && filteredLogs().length > 0" 
        class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-toll-border">
                <th class="px-6 py-3 text-left text-toll-muted text-xs font-display uppercase tracking-wider">
                  License Plate
                </th>
                <th class="px-4 py-3 text-left text-toll-muted text-xs font-display uppercase tracking-wider">
                  Type
                </th>
                <th class="px-4 py-3 text-left text-toll-muted text-xs font-display uppercase tracking-wider hidden md:table-cell">
                  Timestamp
                </th>
                <th class="px-4 py-3 text-right text-toll-muted text-xs font-display uppercase tracking-wider">
                  Fee
                </th>
                <th class="px-4 py-3 text-center text-toll-muted text-xs font-display uppercase tracking-wider">
                  Status
                </th>
                <th class="px-4 py-3 text-center text-toll-muted text-xs font-display uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                *ngFor="let log of filteredLogs(); trackBy: trackById"
                class="border-b border-toll-border/50 table-row-hover group">
                <td class="px-6 py-3.5">
                  <div class="flex items-center gap-2">
                    <span class="font-mono font-semibold text-toll-text tracking-wider">
                      {{ log.licensePlate }}
                    </span>
                    <span
  *ngIf="log.isOfficial"
  class="px-2 py-0.5 rounded-full text-xs bg-blue-50 text-blue-600 border border-blue-200 font-semibold"> GOVT</span>
                  </div>
                </td>
                <td class="px-4 py-3.5">
                  <div class="flex items-center gap-1.5">
                    <span>{{ vehicleIcon(log.vehicleType) }}</span>
                    <span class="text-toll-textDim font-body text-xs">{{ log.vehicleType }}</span>
                  </div>
                </td>

                <td class="px-4 py-3.5 hidden md:table-cell">
                  <span class="text-toll-textDim font-mono text-xs">
                    {{ log.timestamp | date:'dd MMM, hh:mm:ss a' }}
                  </span>
                </td>

                <td class="px-4 py-3.5 text-right">
                  <span
                    class="font-display font-semibold text-sm"
                    [class]="log.tollFee === 0 ? 'text-toll-blue' : 'text-toll-accent'"
                  >
                    {{ log.tollFee | tollCurrency }}
                  </span>
                </td>
            <td class="px-4 py-3.5 text-center">
 <span [ngClass]="statusClass(log.status, log.isOfficial)">
  {{ log.isOfficial ? 'Official' : log.status }}
</span>
</td>

                <td class="px-4 py-3.5 text-center">
                   <div class="flex items-center justify-center gap-1 opacity-1 transition-opacity duration-200">

  <ng-container *ngIf="!log.isOfficial">
    <button
      *ngFor="let s of statusOptions"
      (click)="updateStatus(log, s.value)"
      [title]="'Mark as ' + s.label"
      [disabled]="log.status === s.value"
      class="px-2 py-1 rounded text-xs transition-all duration-150 disabled:opacity-20 disabled:cursor-default"
      [class]="s.class"
    >
      {{ s.label }}
    </button>
  </ng-container>

  <button
    (click)="deleteLog(log)"
    title="Delete"
    class="px-2 py-1 rounded text-xs text-toll-muted hover:text-toll-red hover:bg-toll-red/10 transition-all duration-150 ml-1"
  >
  <i class="fa-solid fa-trash" style="color: rgb(0, 0, 0);"></i>
  </button>
</div>
   
  `, 
})
export class DashboardComponent implements OnInit 
 { private tollService = inject(TollService);

  logs = signal<TollLog[]>([]); 
  loading = signal(true);
  refreshing = signal(false);
  loadError = signal('');
  searchQuery = '';
  vehicleFilter = '';
  statusFilter = '';

  statusOptions = [
    { value: 'Paid' as LogStatus, label: 'Paid', class: 'text-toll-green hover:bg-toll-green/10' },
    { value: 'Pending' as LogStatus, label: 'Pending', class: 'text-toll-yellow hover:bg-toll-yellow/10' },
    { value: 'Violation' as LogStatus, label: 'Flag', class: 'text-toll-red hover:bg-toll-red/10' },
  ];

  filteredLogs = computed(() => {
    return this.logs().filter((log) => {
      const matchesSearch =
        !this.searchQuery ||
        log.licensePlate.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesType =
        !this.vehicleFilter || log.vehicleType === this.vehicleFilter;
      const matchesStatus =
  !this.statusFilter ||
  (this.statusFilter === 'Official'
    ? log.isOfficial
    : log.status === this.statusFilter);
    return matchesSearch && matchesType && matchesStatus;
    });
  });

 stats = computed(() => {
  const all = this.logs();

  return {
    total: all.length,

    paid: all.filter(
      (l) => l.status === 'Paid' && !l.isOfficial
    ).length,

    pending: all.filter(
      (l) => l.status === 'Pending'
    ).length,

    violations: all.filter(
      (l) => l.status === 'Violation'
    ).length,

    official: all.filter(
      (l) => l.isOfficial
    ).length,

    totalRevenue: all.reduce(
      (sum, l) => sum + l.tollFee,
      0
    ),
  };
});

  get activeFilterCount(): number {
    let count = 0;
    if (this.searchQuery) count++;
    if (this.vehicleFilter) count++;
    if (this.statusFilter) count++;
    return count;
  }

  ngOnInit(): void {
    this.loadLogs();
  }

  loadLogs(): void {
    this.loading.set(true);
    this.refreshing.set(true);
    this.loadError.set('');

    this.tollService.getLogs().subscribe({   // component updates signal
      next: (data) => {
        this.logs.set(data);
        this.loading.set(false);
        this.refreshing.set(false);
      },
      error: () => {
        this.loadError.set(
          'Cannot connect to backend. Make sure the server is running on port 3000.'
        );
        this.loading.set(false);
        this.refreshing.set(false);
      },
    });
  }

  /** Called by parent when a new entry is added */
  prependLog(log: TollLog): void {
    this.logs.update((current) => [log, ...current]);
  }

  updateStatus(log: TollLog, status: LogStatus): void {
    this.tollService.updateStatus(log.id, { status }).subscribe({
      next: (updated) => {
        this.logs.update((current) => //Component updates signal here
          current.map((l) => (l.id === updated.id ? updated : l))
        );
      },
    });
  }

  deleteLog(log: TollLog): void {
    this.tollService.deleteLog(log.id).subscribe({
      next: () => {
        this.logs.update((current) => //Component updates signal here
          current.filter((l) => l.id !== log.id));
      },
    });
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.vehicleFilter = '';
    this.statusFilter = '';
  }

  trackById(_: number, log: TollLog): string {
    return log.id;
  }

 vehicleIcon(type: VehicleType): string {
  return {
    Car: '',
    Motorcycle: '',
    Truck: ''
  }[type] ?? 'car';
}

statusClass(status: LogStatus, isOfficial = false): string {
  if (isOfficial) {
    return 'status-official';
  }

return {
  Paid: 'status-paid',
  Pending: 'status-pending',
  Violation: 'status-violation',
  Official: 'status-official'
}[status] ?? 'status-badge';
}
  statusDot(status: LogStatus): string {
    return {
      Paid: 'bg-toll-green',
      Pending: 'bg-toll-yellow',
      Violation: 'bg-toll-red',
      Official: 'bg-blue-500'
    }[status] ?? '';
  }
}
