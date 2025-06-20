import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { Gasto } from 'app/core/models/gasto.model';
import { GastoService } from 'app/core/services-api/gasto.service';
import { Subject, takeUntil } from 'rxjs';
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ApiSort } from 'app/core/models/query.model';
import { FilterService } from 'app/modules/utils/filter.service';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { ResponseApiType } from 'app/core/models/response-api.model';
import { Dialog } from 'primeng/dialog';
import { GastoCreateComponent } from '../gasto-create/gasto-create.component';
import { DatePickerModule } from 'primeng/datepicker';
import { FormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'app-gasto-list',
  imports: [InputNumberModule, FormsModule, DatePickerModule, GastoCreateComponent, Dialog, Toast, TableModule, CommonModule, ButtonModule],
  templateUrl: './gasto-list.component.html',
  providers: [MessageService]
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

  visibleAdd = false;

  filtroFechaRango: Date[] = [];
  filterFecharango=false;

  destroy$ = new Subject<void>();

  constructor(
    private _gastoService: GastoService,
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
  
  getGastosData(event: TableLazyLoadEvent):void{
    this.lastEvent=event;
    this.loading = true;
    const ApiQuery = this._filterService.buildQuery(event, this.rowsDefault, this.OrderDefault);
    this._gastoService.getDataGastos(ApiQuery)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: ResponseApiType<Gasto>)=>{
          this.gastos = res.result.data;
          this.totalRecords = res.result.pagination.totalItems;
          this.loading = false;          
        },
        error: (error)=> {
          this.gastos=[];
          this.totalRecords = 0;
          this.loading = false;
          this._messageService.add(
            { severity: 'error', summary: 'Error de consulta', detail: error.error.message, life: 3000 }
          );
        }
      });
  }

  addGasto():void{
    this.visibleAdd=true;
  }

  closeDialog(update:boolean) {
      this.visibleAdd = false;
      if(update){
        this.reloadTable();
      }
  }

  showHiddeFilters(){
    this.showFilters=!this.showFilters;
    if(!this.showFilters){
      if (this.lastEvent!=null) {
        this.dt.filters={};
        this.lastEvent.filters={};
        this.getGastosData(this.lastEvent);
      }
    }
  }

  onFilterInput(event: Event, field: string, tipo:string) {
    const input = event.target as HTMLInputElement;
    this.dt.filter(input.value, field, tipo);
  } 

  onFilterExactDate(date: Date, field: string): void {
    this.dt.filter(date, field, 'equals');
    this.filtroFechaRango=[];
  }

  onFilterDateRange(dates: any, field: string): void {
    if (dates && dates.length === 2 && dates[0] && dates[1]) {
      const [startDate, endDate] = dates;
      this.dt.filter([startDate, endDate], field, 'between');
    }
  }

  onFilterNumberInput(event: Event, field: string, tipo:string) {
    const input = event.target as HTMLInputElement;
    const number = Number(input.value);
    const [desde, hasta] = [Math.round(number-(number*0.15)), Math.round(number*1.15)];
    this.dt.filter([desde, hasta], field, tipo);
  } 

  reloadTable():void{
    if (this.lastEvent!=null) {
      this.getGastosData(this.lastEvent);
    }
  }

  resetTable():void{
    this.dt.clear();
    this.dt.sortField = this.OrderDefault[0].field;
    this.dt.sortOrder = 1;
    this.filtroFechaRango=[];

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

  mostrarMensaje(detalle: {tipo:string, mensaje:string}) {
    this._messageService.add({
      severity: detalle.tipo,
      summary: detalle.tipo==='error'?'Error de registro':'Exito de registro',
      detail: detalle.mensaje,
      life: 3000
    });
  }

}
