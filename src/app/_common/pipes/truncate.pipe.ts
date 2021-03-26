import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'truncate' })
export class TruncatePipe implements PipeTransform {
  transform(value: string | Date, limit: number = 5): string | Date {
    return Array.from(value.toString()).length > limit
      ? `${value.toString().substring(0, limit)}...`
      : value;
  }
}
