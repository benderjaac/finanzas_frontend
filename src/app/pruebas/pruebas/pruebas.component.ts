import { Component, signal } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { Ripple } from 'primeng/ripple';

import { ViewChild } from '@angular/core';
import { DrawerModule } from 'primeng/drawer';
import { AvatarModule } from 'primeng/avatar';
import { StyleClass } from 'primeng/styleclass';
import { Drawer } from 'primeng/drawer';

@Component({
  selector: 'app-pruebas',
  imports: [Toast, ButtonModule, Ripple, DrawerModule, AvatarModule, StyleClass],
  templateUrl: './pruebas.component.html',
  providers: [MessageService]
})
export class PruebasComponent {
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

  @ViewChild('drawerRef') drawerRef!: Drawer;

    closeCallback(e:any): void {
        this.drawerRef.close(e);
    }

    visible: boolean = false;
}
