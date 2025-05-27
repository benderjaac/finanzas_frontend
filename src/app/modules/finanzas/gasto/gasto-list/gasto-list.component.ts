import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Gasto } from 'app/core/models/gasto.model';
import { ResponseApiType } from 'app/core/models/response-api.model';
import { GastoService } from 'app/core/services-api/gasto.service';
import { Subject, takeUntil } from 'rxjs';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-gasto-list',
  imports: [TableModule, CommonModule, ButtonModule],
  templateUrl: './gasto-list.component.html',
})
export class GastoListComponent {

  gastos : Gasto[] = [];

  destroy$ = new Subject<void>();

  constructor(
    private _gastoService: GastoService,
  ){

  }

  ngOnInit():void{
    this._gastoService.getGastos()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: ResponseApiType<Gasto>) =>{
          this.gastos = response.data;
        },
        error: () =>{

        }
      });
  }

  ngOnDestroy():void{
    this.destroy$.next();
    this.destroy$.complete();
  }

  addGasto():void{

  }

}
