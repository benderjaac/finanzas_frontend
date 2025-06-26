import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { CategoriaIngreso } from 'app/core/models/categoria-ingreso.model';
import { ApiSort } from 'app/core/models/query.model';
import { ResponseApiType } from 'app/core/models/response-api.model';
import { CategoriaIngresoService } from 'app/core/services-api/categoria-ingreso.service';
import { FilterService } from 'app/modules/utils/filter.service';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import { Toast } from 'primeng/toast';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-categoria-ingreso-list',
  imports: [Toast, TableModule, CommonModule, ButtonModule],
  templateUrl: './categoria-ingreso-list.component.html',
  providers: [MessageService]
})
export class CategoriaIngresoListComponent {
  @ViewChild('dt') dt!: Table;

  categoriasI : CategoriaIngreso[] = [];
  totalRecords = 0;
  
  rowsPerPageOptions: number[] = [];
  rowsDefault = 0;
  OrderDefault: ApiSort[] = [{field:'id', order:'DESC'}];

  lastEvent : TableLazyLoadEvent|null = null;
  showFilters : boolean = false;

  loading = false;

  destroy$ = new Subject<void>();

  constructor(
    private _categoriaIngresoService: CategoriaIngresoService,
    private _filterService: FilterService,
    private _messageService: MessageService,
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
  
  getCategoriasIngresoData(event: TableLazyLoadEvent):void{
    this.lastEvent=event;
    this.loading = true;
    const ApiQuery = this._filterService.buildQuery(event, this.rowsDefault, this.OrderDefault);
    this._categoriaIngresoService.getDataCategoriasIngreso(ApiQuery)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: ResponseApiType<CategoriaIngreso>)=>{
          this.categoriasI = res.result.data;
          this.totalRecords = res.result.pagination.totalItems;
          this.loading = false;          
        },
        error: (error)=> {
          this.categoriasI=[];
          this.totalRecords = 0;
          this.loading = false;
          this._messageService.add(
            { severity: 'error', summary: 'Error de consulta', detail: error.error.message, life: 3000 }
          );
        }
      });
  }

  addGasto():void{

  }

  showHiddeFilters(){
    this.showFilters=!this.showFilters;
    if(!this.showFilters){
      if (this.lastEvent!=null) {
        this.dt.filters={};
        this.lastEvent.filters={};
        this.getCategoriasIngresoData(this.lastEvent);
      }
    }
  }

  onFilterInput(event: Event, field: string, tipo:string) {
    const input = event.target as HTMLInputElement;
    this.dt.filter(input.value, field, tipo);
  } 

  reloadTable():void{
    if (this.lastEvent!=null) {
      this.getCategoriasIngresoData(this.lastEvent);
    }
  }

  resetTable():void{
    this.dt.clear();
    this.dt.sortField = this.OrderDefault[0].field;
    this.dt.sortOrder = 1;

    const event = {
      first: 0,
      rows: this.rowsDefault,
      sortField: null,
      sortOrder: null,
      filters: {},
      globalFilter: null
    };
    this.showFilters=false;
    this.getCategoriasIngresoData(event); // dispara la carga manual
  }
}
