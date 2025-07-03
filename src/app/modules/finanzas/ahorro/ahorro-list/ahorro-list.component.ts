import { Component, signal } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Ahorro } from 'app/core/models/ahorro.model';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { DataView } from 'primeng/dataview';
import { SelectButton } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import { ProgressBar } from 'primeng/progressbar';
import { ButtonModule } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { AhorroCreateComponent } from '../ahorro-create/ahorro-create.component';
import { AhorroService } from 'app/core/services-api/ahorro.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ahorro-list',
  imports: [CommonModule, Toast, DataView, SelectButton, FormsModule, ProgressBar, ButtonModule, Dialog, AhorroCreateComponent],
  templateUrl: './ahorro-list.component.html',
  providers: [MessageService]
})
export class AhorroListComponent {

  layout: 'list' | 'grid' = 'list';
  options = ['list', 'grid'];

  ahorros = signal<Ahorro[]>([]);

  visibleAdd = false;

  destroy$ = new Subject<void>();

  constructor(
    private _ahorroService: AhorroService,
    private _messageService: MessageService,
    private router: Router
  ){

  }

  ngOnInit(){
    this.obtenerData();
  }

  ngOnDestroy() {
    
  }

  obtenerData():void{
    this._ahorroService.getDataAhorroCat()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resp) => {
          this.ahorros.set(
            resp.result.data.map(a => ({
              ...a,
              porcentaje: Math.round((a.monto_actual / a.monto_meta) * 100)
            }))
          );
        },
        error: (error) => {
          console.error(error);
        }
      });   
  }

  addAhorro():void{
    this.visibleAdd=true;
  }

  closeDialog(update:boolean) {
      this.visibleAdd = false;
      if(update){
        this.obtenerData();
      }
  }

  mostrarMensaje(detalle: {tipo:string, mensaje:string}) {
    this._messageService.add({
      severity: detalle.tipo,
      summary: detalle.tipo==='error'?'Error de registro':'Exito de registro',
      detail: detalle.mensaje,
      life: 3000
    });
  }

  detalleAhorro(idAhorro:number):void{
    this.router.navigateByUrl('/finanzas/ahorro/list/'+idAhorro);
  }

  
}
