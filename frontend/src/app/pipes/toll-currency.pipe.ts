import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'tollCurrency', standalone: true })
export class TollCurrencyPipe implements PipeTransform {
  transform(value: number): string {
    if (value === 0) return 'FREE';
    return `$${value.toFixed(2)}`;
  }
}
