import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
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
import { CatalogoStoreService } from '../../servicios/catalogo-store.service';
import { CategoriaGasto } from 'app/core/models/categoria-gasto.model';
import { Select } from 'primeng/select';

@Component({
  selector: 'app-gasto-list',
  imports: [Select, InputNumberModule, FormsModule, DatePickerModule, GastoCreateComponent, Dialog, Toast, TableModule, CommonModule, ButtonModule],
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

  catCategorias : CategoriaGasto[] = [];

  clonedGastos: { [s: string]: Gasto } = {};

  destroy$ = new Subject<void>();

  constructor(
    private _gastoService: GastoService,
    private _filterService: FilterService,
    private _messageService: MessageService,
    private _catalogoStoreService: CatalogoStoreService,
    private cdr: ChangeDetectorRef,
  ){
    this.rowsPerPageOptions = [10, 20, 50, 100]
    this.rowsDefault = this.rowsPerPageOptions[0];    
  }

  ngOnInit():void{
    this._catalogoStoreService.getCatalogo('categorias_gastos')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resp) => {
          this.catCategorias = resp.result.data;
        },
        error: (error) => {
          console.error(error);
        }
      });
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
          this.gastos.map(g => {
            this.dt.cancelRowEdit(g);
            g.editing = false
          });
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

  onRowEditInit(gasto: Gasto) {
    this.cancelAllActiveEditions();
    this.clonedGastos[gasto.id as unknown as string] = { ...gasto };
    gasto.editing = true;
  }

  onRowEditSave(gasto: Gasto) {
    console.log("gasto pre-update", gasto);
    gasto.fecha= new Date(gasto.fecha).toISOString().split('T')[0];
    
    const values = {
      monto: gasto.monto,
      descri: gasto.descri,
      categoriaId: gasto.categoria_id,
      fecha: gasto.fecha,
    };
    
    this._gastoService.updateGasto(gasto.id, values)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this._messageService.add({ 
            severity: 'success', 
            summary: 'Gasto actualizado correctamente', 
            detail: res.message 
          });
          gasto.editing = false;
          delete this.clonedGastos[gasto.id as unknown as string];
        },
        error: (error) => {
          this._messageService.add({ 
            severity: 'error', 
            summary: 'Error al actualizar el gasto', 
            detail: error.error.error 
          });
        }
      });

    //delete this.clonedGastos[gasto.id as unknown as string];
    //this._messageService.add({ severity: 'success', summary: 'Success', detail: 'Product is updated' });
      
  }

  onRowEditCancel(gasto: Gasto, index: number) {
    if (this.clonedGastos[gasto.id as unknown as string]) {
      this.gastos[index] = { ...this.clonedGastos[gasto.id as unknown as string] };
      delete this.clonedGastos[gasto.id as unknown as string];
    }
    this.dt.cancelRowEdit(this.gastos[index]);
    gasto.editing = false;
  }

  cancelAllActiveEditions(): void {
    this.gastos.forEach((gasto, index) => {
      if (gasto.editing) {
        this.onRowEditCancel(gasto, index);        
      }
    });    
    
    this.cdr.detectChanges();
  }

  onCategoriaChange(event: any, gasto: Gasto) {
    const categoriaSeleccionada = this.catCategorias.find(cat => cat.id === event.value);
    
    if (categoriaSeleccionada) {
        gasto.categoria_id = categoriaSeleccionada.id;
        gasto.categoriaNombre = categoriaSeleccionada.nombre;
        gasto.categoriaIcon = categoriaSeleccionada.icon;
        gasto.categoriaColor = categoriaSeleccionada.color;
    }
  }

}
