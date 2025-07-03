import { CommonModule } from '@angular/common';
import { Component, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AhorroDeposito } from 'app/core/models/ahorro-deposito.model';
import { Ahorro } from 'app/core/models/ahorro.model';
import { ApiSort } from 'app/core/models/query.model';
import { ResponseApiType } from 'app/core/models/response-api.model';
import { AhorroService } from 'app/core/services-api/ahorro.service';
import { AhorroDepositoService } from 'app/core/services-api/ahorroDeposito.service';
import { FilterService } from 'app/modules/utils/filter.service';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumberModule } from 'primeng/inputnumber';
import { ProgressBar } from 'primeng/progressbar';
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import { Toast } from 'primeng/toast';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-ahorro-detalle',
  imports: [InputNumberModule, FormsModule, DatePickerModule, Toast, TableModule, CommonModule, ButtonModule, ProgressBar],
  templateUrl: './ahorro-detalle.component.html',
  providers: [MessageService]
})
export class AhorroDetalleComponent {
  destroy$ = new Subject<void>();

  idAhorro! : number;
  ahorro!: Ahorro;
  porcentaje!:number;

  @ViewChild('dt') dt!: Table;

  ahorroDepositos : AhorroDeposito[] = [];
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

  constructor(
    private _ahorroService: AhorroService,
    private _ahorroDepositoService: AhorroDepositoService,
    private _filterService: FilterService,
    private _messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router
  ){
    this.rowsPerPageOptions = [10, 20, 50, 100]
    this.rowsDefault = this.rowsPerPageOptions[0];    
  }

  ngOnInit(){
    this.route.params.subscribe(params => {
      this.idAhorro = parseInt(params['id'], 10);
      this.obtenerDetalle();
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  obtenerDetalle():void{
    this._ahorroService.getById(this.idAhorro)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resp) => {
          this.ahorro = resp.result;
          this.porcentaje= Math.round((this.ahorro.monto_actual / this.ahorro.monto_meta) * 100)
          this.getData(this.lastEvent);
        },
        error: (error) => {
          console.error(error);
          this.router.navigateByUrl('/finanzas/ahorro/list/');
        }
      });  
  }

  getData(event: TableLazyLoadEvent|null):void{
    this.lastEvent=event;
    this.loading = true;
    const ApiQuery = this._filterService.buildQuery(event!, this.rowsDefault, this.OrderDefault);
    this._ahorroDepositoService.getData(this.idAhorro, ApiQuery)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: ResponseApiType<AhorroDeposito>)=>{
          this.ahorroDepositos = res.result.data;
          this.totalRecords = res.result.pagination.totalItems;
          this.loading = false;          
        },
        error: (error)=> {
          this.ahorroDepositos=[];
          this.totalRecords = 0;
          this.loading = false;
          this._messageService.add(
            { severity: 'error', summary: 'Error de consulta', detail: error.error.message, life: 3000 }
          );
        }
      });  
  }

  addAhorroDeposito():void{
    this.visibleAdd=true;
  }  

  showHiddeFilters(){
    this.showFilters=!this.showFilters;
    if(!this.showFilters){
      if (this.lastEvent!=null) {
        this.dt.filters={};
        this.lastEvent.filters={};
        this.getData(this.lastEvent);
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
      this.getData(this.lastEvent);
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
    this.getData(event); // dispara la carga manual
  }
}
