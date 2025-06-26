import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GastoService } from 'app/core/services-api/gasto.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CatalogoStoreService } from '../../servicios/catalogo-store.service';
import { CategoriaGasto } from 'app/core/models/categoria-gasto.model';
import { Select } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumber } from 'primeng/inputnumber';
import { AutofocusDirective } from 'app/modules/utils/autofocus.directive';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-gasto-create',
  imports: [AutofocusDirective, InputNumber, DatePickerModule, Select, ReactiveFormsModule, InputTextModule, ButtonModule, CommonModule],
  standalone: true,
  templateUrl: './gasto-create.component.html',
})
export class GastoCreateComponent {
  @Output() msjEvent = new EventEmitter<{tipo:string, mensaje:string}>();
  @Output() cerrarDialog = new EventEmitter<boolean>();

  registerForm!: FormGroup;

  catCategorias : CategoriaGasto[] = [];

  hoy = new Date();

  destroy$ = new Subject<void>();

  constructor(
    private _gastoService: GastoService,
    private _fb: FormBuilder,
    private _catalogoStoreService: CatalogoStoreService,
  ){    
  }

  ngOnInit(){
    
    this.registerForm = this._fb.group({
      monto: ['', Validators.required],
      descri: ['', Validators.required],
      categoriaId: ['',Validators.required],
      fecha: [this.hoy, Validators.required],
    });

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

  onSubmit() {
    if (this.registerForm.valid) {
      const values = this.registerForm.value;
      values.categoriaId=this.registerForm.get('categoriaId')?.value.id;

      this._gastoService.createGasto(this.registerForm.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          
          next: (res)=>{
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
