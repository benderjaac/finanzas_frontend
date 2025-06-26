import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoriaIngresoService } from 'app/core/services-api/categoria-ingreso.service';
import { AutofocusDirective } from 'app/modules/utils/autofocus.directive';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-categoria-ingreso-create',
  imports: [AutofocusDirective, ReactiveFormsModule, InputTextModule, ButtonModule, CommonModule],
  templateUrl: './categoria-ingreso-create.component.html',
})
export class CategoriaIngresoCreateComponent {
  @Output() msjEvent = new EventEmitter<{tipo:string, mensaje:string}>();
  @Output() cerrarDialog = new EventEmitter<boolean>();

  registerForm!: FormGroup;

  destroy$ = new Subject<void>();

  constructor(
    private _categoriaIngresoService: CategoriaIngresoService,
    private _fb: FormBuilder
  ){    
  }

  ngOnInit(){
    
    this.registerForm = this._fb.group({
      nombre: ['', Validators.required],
      descri: [''],
      color: [''],
      icon: [''],
    });
    
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const values = this.registerForm.value;
      values.categoriaId=this.registerForm.get('categoriaId')?.value.id;

      this._categoriaIngresoService.createCategoriaIngreso(this.registerForm.value)
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
