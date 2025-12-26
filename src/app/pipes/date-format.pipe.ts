import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
    name: 'dateFormat',
    standalone: true
})
export class DateFormatPipe implements PipeTransform {
    private datePipe = new DatePipe('pt-BR');

    transform(value: string | Date | null | undefined): string {
        if (!value) return '';
        return this.datePipe.transform(value, 'dd/MM/yyyy HH:mm') || '';
    }
}
