import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AhorroDepositoService } from 'app/core/services-api/ahorroDeposito.service';
import { BalanceUsuarioService } from 'app/core/services-api/balance-usuario.service';
import { AutofocusDirective } from 'app/modules/utils/autofocus.directive';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumber } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-ahorro-deposito-create',
  imports: [AutofocusDirective, InputNumber, DatePickerModule, ReactiveFormsModule, InputTextModule, ButtonModule, CommonModule],
  templateUrl: './ahorroDeposito-create.component.html'
})
export class AhorroDepositoCreateComponent {
  @Output() msjEvent = new EventEmitter<{tipo:string, mensaje:string}>();
  @Output() cerrarDialog = new EventEmitter<boolean>();

  @Input() ahorroId!: number;
  @Input() tipoDeposito!: 'deposito'|'retiro';

  registerForm!: FormGroup;

  hoy = new Date();

  destroy$ = new Subject<void>();

  constructor(
    private _ahorroDepositoService: AhorroDepositoService,
    private _fb: FormBuilder,
    private _balanceUsuarioService: BalanceUsuarioService
  ){
  }

  ngOnInit(){

    this.registerForm = this._fb.group({
      descri: ['', Validators.required],
      monto: ['', Validators.required],
      fecha: [this.hoy, Validators.required],
    });

  }

  onSubmit() {
    if (this.registerForm.valid) {
      
      if(this.tipoDeposito === 'retiro'){
        this.registerForm.patchValue({monto: -this.registerForm.value.monto});
      }

      this._ahorroDepositoService.create(this.ahorroId, this.registerForm.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe({

          next: (res)=>{
            this._balanceUsuarioService.setBalance(res.result);
            this.msjEvent.emit({tipo:'success', mensaje:res.message});
            this.cerrarDialog.emit(true);
          },
          error: (error)=>{
            this.msjEvent.emit({tipo:'error', mensaje:error.error?.error || "Error desconocido"});
          }
        });
    }
  }
}
