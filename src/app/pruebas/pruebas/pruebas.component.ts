import { Component, signal } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { Ripple } from 'primeng/ripple';

@Component({
  selector: 'app-pruebas',
  imports: [Toast, ButtonModule, Ripple],
  templateUrl: './pruebas.component.html',
  styleUrl: './pruebas.component.css',
  providers: [MessageService]
})
export class PruebasComponent {
  title = 'Ejemplos';
  constructor(
    private messageService: MessageService
  ){
  }

  options = signal<string[]>(['Mexico','Jalisco','Oaxaca']);
  selectedOption=signal<number>(-1);

  selectOption(index:number):void{
    this.selectedOption.set(index);
  }

  show() {
    this.messageService.add(
      { severity: 'info', summary: 'Info', detail: 'Message Content', life: 3000 }
    );
  }
}
