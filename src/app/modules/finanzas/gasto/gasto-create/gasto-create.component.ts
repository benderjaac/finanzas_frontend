import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GastoService } from 'app/core/services-api/gasto.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-gasto-create',
  imports: [ReactiveFormsModule, InputTextModule, ButtonModule, CommonModule],
  templateUrl: './gasto-create.component.html',
})
export class GastoCreateComponent {
  @Output() msjEvent = new EventEmitter<{tipo:string, mensaje:string}>();
  @Output() cerrarDialog = new EventEmitter<boolean>();

  @ViewChild('montoInput') montoInput!: ElementRef;
  
  registerForm!: FormGroup;

  constructor(
    private _gastoService: GastoService,
    private _fb: FormBuilder,
  ){    
  }

  ngOnInit(){
    
    this.registerForm = this._fb.group({
      monto: ['', Validators.required],
      descri: ['', Validators.required],
      categoriaId: [101,Validators.required],
      fecha: ['2025-06-06',Validators.required],
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.montoInput?.nativeElement?.focus();
    }, 200);
  }

  onSubmit() {
    if (this.registerForm.valid) {
      
      this._gastoService.createGasto(this.registerForm.value).subscribe({
        
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
