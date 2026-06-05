import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NewEntryFormComponent } from './components/new-entry-form/new-entry-form.component';
import { TollLog } from './models/toll-log.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, DashboardComponent, NewEntryFormComponent],
  template: `
    <div class="min-h-screen bg-green-100">
      
<header class="bg-gradient-to-r from-green-600 via-green-700 to-emerald-700 sticky top-0 z-50 shadow-2xl">
        <div class="max-w-screen-2xl mx-auto px-6 py-5 flex items-center justify-between">
          <div class="flex items-center gap-3">
<div class="w-9 h-9 bg-green-100 rounded-xl shadow-md flex items-center justify-center text-green-700 font-bold text-sm font-display">
  T
</div>
            <div>
     <span class="font-display font-bold text-white text-3xl tracking-tight">
  Toll Plaza
</span>

<span class="hidden sm:inline text-green-100 text-xs font-body ml-2">
  Operator Dashboard
</span>
            </div>
          </div>
              <div class="flex items-center gap-4">

      <div class="flex items-center gap-2 px-4 py-1.5 bg-white/15 border border-white/20 rounded-full backdrop-blur-md">
        <span class="w-2.5 h-2.5 bg-green-300 rounded-full animate-pulse"></span>
        <span class="text-white text-xs font-semibold uppercase tracking-wider">
          LIVE
        </span>
      </div>
           
          </div>
        </div>
      </header>

      <main class="max-w-screen-2xl mx-auto">
        <div class="flex flex-col lg:flex-row gap-0">
          <aside class="lg:w-80 xl:w-96 shrink-0 p-6 lg:border-r border-toll-border lg:min-h-screen">
            <app-new-entry-form (entryCreated)="onEntryCreated($event)" />
            <div class="mt-4 card p-4 space-y-2">
              <h3 class="text-toll-muted text-xs font-display uppercase tracking-widest">Fee Schedule</h3>
              <div class="space-y-1.5">
                <div class="flex justify-between items-center">
                  <span class="text-toll-textDim text-xs font-body flex items-center gap-1.5">Car</span>
                  <span class="font-mono text-xs text-toll-accent font-semibold">$5.00</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-toll-textDim text-xs font-body flex items-center gap-1.5">Motorcycle</span>
                  <span class="font-mono text-xs text-toll-accent font-semibold">$2.00</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-toll-textDim text-xs font-body flex items-center gap-1.5">Truck</span>
                  <span class="font-mono text-xs text-toll-accent font-semibold">$10.00</span>
                </div>
                <div class="border-t border-toll-border pt-1.5 flex justify-between items-center">
                  <span class="text-toll-textDim text-xs font-body flex items-center gap-1.5">Govt/Official</span>
                  <span class="font-mono text-xs text-toll-blue font-semibold">FREE</span>
                </div>
              </div>
            </div>
          </aside>

          <section class="flex-1 min-w-0">
            <app-dashboard #dashboard />
          </section>

        </div>
      </main>

    </div>
  `,
})
export class AppComponent {
  @ViewChild('dashboard') dashboard!: DashboardComponent;

  onEntryCreated(log: TollLog): void {
    this.dashboard.prependLog(log);
  }
}
