import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Gasto } from 'app/core/models/gasto.model';
import { ResponseApiType } from 'app/core/models/response-api.model';
import { GastoService } from 'app/core/services-api/gasto.service';
import { Subject, takeUntil } from 'rxjs';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ApiQuery } from 'app/core/models/query.model';

@Component({
  selector: 'app-gasto-list',
  imports: [TableModule, CommonModule, ButtonModule],
  templateUrl: './gasto-list.component.html',
})
export class GastoListComponent {

  gastos : Gasto[] = [];
  totalRecords = 0;
  
  rowsPerPageOptions: number[] = [];
  rowsDefault = 0;

  loading = false;

  destroy$ = new Subject<void>();

  constructor(
    private _gastoService: GastoService,
  ){
    this.rowsPerPageOptions = [10, 20, 50, 100]
    this.rowsDefault = this.rowsPerPageOptions[0];
  }

  ngOnInit():void{
    
  }

  ngOnDestroy():void{
    this.destroy$.next();
    this.destroy$.complete();
  }

  getgastosData(event: TableLazyLoadEvent):void{
      
    this.loading = true;

    const page = (event.first ?? 0) / (event.rows ?? 10) + 1;
    const perPage = event.rows ?? 10;

    const query: ApiQuery = {
      filters: [], // Más adelante puedes llenar con filtros
      sorter: typeof event.sortField === 'string'
      ? [{
          field: event.sortField,
          order: event.sortOrder === 1 ? 'ASC' : 'DESC',
        }]
      : [],
      pagination: {
        perPage,
        currentPage: page,
      },
    };

    this._gastoService.getDataGastos(query)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res)=>{
          this.gastos = res.result.data;
          this.totalRecords = res.result.pagination.totalItems;
          this.loading = false;          
        },
        error: (error)=> {
          this.gastos=[];
          this.totalRecords = 0;
          this.loading = false;
        }
      });
  }

  addGasto():void{

  }

}
