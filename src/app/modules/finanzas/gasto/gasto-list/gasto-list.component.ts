import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { Gasto } from 'app/core/models/gasto.model';
import { GastoService } from 'app/core/services-api/gasto.service';
import { Subject, takeUntil } from 'rxjs';
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ApiSort } from 'app/core/models/query.model';
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

  lastEvent : TableLazyLoadEvent|null = null;
  showFilters : boolean = false;

  loading = false;

  destroy$ = new Subject<void>();

  constructor(
    private _gastoService: GastoService,
    private _filterService: FilterService
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
  
  getGastosData(event: TableLazyLoadEvent):void{
    this.lastEvent=event;
    this.loading = true;
    const ApiQuery = this._filterService.buildQuery(event, this.rowsDefault, this.OrderDefault);
    this._gastoService.getDataGastos(ApiQuery)
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

  reloadTable():void{
    if (this.lastEvent!=null) {
      this.getGastosData(this.lastEvent);
    }
  }

  resetTable():void{
    // Limpia filtros y ordenamiento
    this.dt.clear(); // limpia filtros y orden
    this.dt.sortField = '';
    this.dt.sortOrder = 1;

    // Reinicia paginación manualmente
    const event = {
      first: 0,
      rows: this.rowsDefault,
      sortField: null,
      sortOrder: null,
      filters: {},
      globalFilter: null
    };
    this.showFilters=false;
    this.getGastosData(event); // dispara la carga manual
  }

}
