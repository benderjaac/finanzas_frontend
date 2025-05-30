import { Injectable } from '@angular/core';
import { ApiFilter, ApiQuery, ApiSort } from 'app/core/models/query.model';
import { TableLazyLoadEvent } from 'primeng/table';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  constructor() { }

  public buildQuery(event: TableLazyLoadEvent, rowsDefault:number, OrderDefault: ApiSort[]):ApiQuery{

    const filters: ApiFilter[] = [];

    if (event.filters) {
      for (const field in event.filters) {
        const filterMeta = event.filters[field];
        if(filterMeta !== undefined){
          const filter = Array.isArray(filterMeta) ? filterMeta[0] : filterMeta;
          const filterValue = filter.value;
          const matchMode = filter.matchMode;

          if (filterValue !== null && filterValue !== undefined && filterValue !== '') {
            let operator = '=';
            switch (matchMode) {
              case 'contains':
                operator = '_lk_';
                break;
              case 'equals':
                operator = '=';
                break;
              case 'startsWith':
                operator = '_lk_';
                break;
              case 'endsWith':
                operator = '_lk_';
                break;
              // puedes agregar más según lo que manejes en tu backend
            }

            const type = typeof filterValue === 'boolean'
              ? 'boolean'
              : typeof filterValue === 'number'
              ? 'number'
              : 'string';

            filters.push({
              field,
              operator,
              value: filterValue,
              type
            });
          }
        }        
      }
    }

    const page = (event.first ?? 0) / (event.rows ?? rowsDefault) + 1;
    const perPage = event.rows ?? rowsDefault;

    return {
      filters: filters,
      sorter: typeof event.sortField === 'string'
      ? [{
          field: event.sortField,
          order: event.sortOrder === 1 ? 'ASC' : 'DESC',
        }]
      : OrderDefault,
      pagination: {
        perPage: perPage,
        currentPage: page,
      },
    };
    
  }
}
