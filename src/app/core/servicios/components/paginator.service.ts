import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';

@Injectable({
  providedIn: 'root'
})
export class PaginatorService extends MatPaginatorIntl {
  itemsPerPageLabel = ' Artículos por hoja';
  nextPageLabel     = 'Siguiente';
  previousPageLabel = 'Anterior';

}
