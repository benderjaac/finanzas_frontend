import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { Gasto } from 'app/core/models/gasto.model';
import { ResponseApiType } from 'app/core/models/response-api.model';
import { GastoService } from 'app/core/services-api/gasto.service';
import { Subject, takeUntil } from 'rxjs';
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ApiFilter, ApiQuery, ApiSort } from 'app/core/models/query.model';
import { FilterService } from 'app/modules/utils/filter.service';

@Component({
  selector: 'app-gasto-list',
  imports: [TableModule, CommonModule, ButtonModule],
  templateUrl: './gasto-list.component.html',
})
export class GastoListComponent {

  @ViewChild('dt') dt!: Table;

  gastos : Gasto[] = [];
  totalRecords = 0;
  
  rowsPerPageOptions: number[] = [];
  rowsDefault = 0;
  OrderDefault: ApiSort[] = [{field:'fecha', order:'DESC'}];
  ApiQuery : ApiQuery;

  loading = false;

  destroy$ = new Subject<void>();

  constructor(
    private _gastoService: GastoService,
    private _filterService: FilterService
  ){
    this.rowsPerPageOptions = [10, 20, 50, 100]
    this.rowsDefault = this.rowsPerPageOptions[0];
    this.ApiQuery = {
      filters: [], // Más adelante puedes llenar con filtros
      sorter: this.OrderDefault,
      pagination: {
        perPage:this.rowsDefault,
        currentPage: 1,
      },
    };
  }

  ngOnInit():void{
    
  }

  ngOnDestroy():void{
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  getGastosData(event: TableLazyLoadEvent):void{
      
    this.loading = true;
    const query = this._filterService.buildQuery(event, this.rowsDefault, this.OrderDefault);
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

  onFilterInput(event: Event, field: string, tipo:string) {
    const input = event.target as HTMLInputElement;
    this.dt.filter(input.value, field, tipo);
  } 

}
