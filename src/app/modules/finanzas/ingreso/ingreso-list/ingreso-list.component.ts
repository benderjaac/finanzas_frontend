import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Ingreso } from 'app/core/models/ingreso.model';
import { ApiSort } from 'app/core/models/query.model';
import { ResponseApiType } from 'app/core/models/response-api.model';
import { IngresoService } from 'app/core/services-api/ingreso.service';
import { FilterService } from 'app/modules/utils/filter.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { Dialog } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import { Toast } from 'primeng/toast';
import { Subject, takeUntil } from 'rxjs';
import { IngresoCreateComponent } from '../ingreso-create/ingreso-create.component';
import { Select } from 'primeng/select';
import { CategoriaIngreso } from 'app/core/models/categoria-ingreso.model';
import { CatalogoStoreService } from '../../servicios/catalogo-store.service';
import {Ripple} from 'primeng/ripple';
import { BalanceUsuarioService } from 'app/core/services-api/balance-usuario.service';
import { ConfirmPopupModule } from 'primeng/confirmpopup';

@Component({
  selector: 'app-ingreso-list',
  imports: [ConfirmPopupModule, Select, InputNumberModule, FormsModule, DatePickerModule, IngresoCreateComponent, Dialog, Toast, TableModule, CommonModule, ButtonModule, Ripple],
  templateUrl: './ingreso-list.component.html',
  providers: [ConfirmationService, MessageService]
})
export class IngresoListComponent {
  @ViewChild('dt') dt!: Table;

  ingresos : Ingreso[] = [];
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

  catCategorias : CategoriaIngreso[] = [];

  clonedIngresos: { [s: string]: Ingreso } = {};

  destroy$ = new Subject<void>();

  constructor(
    private _ingresoService: IngresoService,
    private _filterService: FilterService,
    private _messageService: MessageService,
    private _catalogoStoreService: CatalogoStoreService,
    private cdr: ChangeDetectorRef,
    private _balanceUsuarioService: BalanceUsuarioService,
    private confirmationService: ConfirmationService,
  ){
    this.rowsPerPageOptions = [10, 20, 50, 100]
    this.rowsDefault = this.rowsPerPageOptions[0];
  }

  ngOnInit():void{
    this._catalogoStoreService.getCatalogo('categorias_ingresos')
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

  getIngresosData(event: TableLazyLoadEvent):void{
    this.lastEvent=event;
    this.loading = true;
    const ApiQuery = this._filterService.buildQuery(event, this.rowsDefault, this.OrderDefault);
    this._ingresoService.getDataIngresos(ApiQuery)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: ResponseApiType<Ingreso>)=>{
          this.ingresos = res.result.data;
          this.ingresos.map(g => {
            this.dt.cancelRowEdit(g);
            g.editing = false
          });
          this.totalRecords = res.result.pagination.totalItems;
          this.loading = false;
        },
        error: (error)=> {
          this.ingresos=[];
          this.totalRecords = 0;
          this.loading = false;
          this._messageService.add(
            { severity: 'error', summary: 'Error de consulta', detail: error.error.message, life: 3000 }
          );
        }
      });
  }

  addIngreso():void{
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
        this.getIngresosData(this.lastEvent);
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
      this.getIngresosData(this.lastEvent);
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
    this.getIngresosData(event);
  }

  mostrarMensaje(detalle: {tipo:string, mensaje:string}) {
    this._messageService.add({
      severity: detalle.tipo,
      summary: detalle.tipo==='error'?'Error de registro':'Exito de registro',
      detail: detalle.mensaje,
      life: 3000
    });
  }

  onRowEditInit(ingreso: Ingreso) {
    this.cancelAllActiveEditions();
    this.clonedIngresos[ingreso.id as unknown as string] = { ...ingreso };
    ingreso.editing = true;
  }

  onRowEditSave(ingreso: Ingreso, ri: number) {
    ingreso.fecha= new Date(ingreso.fecha).toISOString().split('T')[0];

    const values = {
      monto: ingreso.monto,
      descri: ingreso.descri,
      categoriaId: ingreso.categoria_id,
      fecha: ingreso.fecha,
    };

    this._ingresoService.updateIngreso(ingreso.id, values)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this._balanceUsuarioService.setDisponible(res.result.montoDisponible);
          this._messageService.add({
            severity: 'success',
            summary: 'Ingreso actualizado correctamente',
            detail: res.message
          });
          ingreso.editing = false;
          delete this.clonedIngresos[ingreso.id as unknown as string];
        },
        error: (error) => {
          this._messageService.add({
            severity: 'error',
            summary: 'Error al actualizar el ingreso',
            detail: error.error.error
          });
          this.onRowEditCancel(ingreso, ri);
        }
      });

  }

  onRowEditCancel(ingreso: Ingreso, index: number) {
    if (this.clonedIngresos[ingreso.id as unknown as string]) {
      this.ingresos[index] = { ...this.clonedIngresos[ingreso.id as unknown as string] };
      delete this.clonedIngresos[ingreso.id as unknown as string];
    }
    this.dt.cancelRowEdit(this.ingresos[index]);
    ingreso.editing = false;
  }

  cancelAllActiveEditions(): void {
    this.ingresos.forEach((ingreso, index) => {
      if (ingreso.editing) {
        this.onRowEditCancel(ingreso, index);
      }
    });

    this.cdr.detectChanges();
  }

  onCategoriaChange(event: any, ingreso: Ingreso) {
    const categoriaSeleccionada = this.catCategorias.find(cat => cat.id === event.value);

    if (categoriaSeleccionada) {
        ingreso.categoria_id = categoriaSeleccionada.id;
        ingreso.categoriaNombre = categoriaSeleccionada.nombre;
        ingreso.categoriaIcon = categoriaSeleccionada.icon;
        ingreso.categoriaColor = categoriaSeleccionada.color;
    }
  }

  onDelete(ingreso:Ingreso, event: Event):void{
      this.confirmationService.close();
      
      setTimeout(() => {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: '¿Estás seguro de eliminar: "' + ingreso.descri + '"?',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Eliminar',
            rejectLabel: 'Cancelar',
            acceptButtonStyleClass: 'p-button-sm p-button-danger',
            rejectButtonStyleClass: 'p-button-sm p-button-text',
            closeOnEscape: true,
            accept: () => {
                this.deleteIngreso(ingreso.id);
            },
            reject: () => {
            }
        });
      }, 200); 
      
    }

  deleteIngreso(id:number):void{
    this._ingresoService.deleteIngreso(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this._balanceUsuarioService.setDisponible(res.result.montoDisponible);
          this._messageService.add({
            severity: 'success',
            summary: 'Ingreso eliminado correctamente',
            detail: res.message
          });
          this.reloadTable();   
        },
        error: (error) => {
          this._messageService.add({
            severity: 'error',
            summary: 'Error al eliminar el ingreso',
            detail: error.error.error
          });
        }
      });
  }
}
