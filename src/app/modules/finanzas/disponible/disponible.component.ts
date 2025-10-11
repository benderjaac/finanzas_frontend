import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal, Signal } from '@angular/core';
import { BalanceUsuarioService } from 'app/core/services-api/balance-usuario.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-disponible',
  imports: [CommonModule],
  template: `
  <div class="flex mr-4 items-center p-3">
    
      <span class="font-semibold text-muted-color">Disponible: </span>
      <span 
      class="ml-2 font-bold"
      [ngClass]="{'text-red-500': disponible() < 0, 'text-green-500': disponible() >= 0}">{{ disponible() | currency }}</span>
    
  </div>
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DisponibleComponent {

  disponible = signal<number>(0);

  destroy$ = new Subject<void>();

  constructor(
    private _balanceUsuarioService: BalanceUsuarioService,
  ) {
  }

  ngOnInit(): void {

    this._balanceUsuarioService.getDataBalanceUsuario().subscribe({
      next: (res) => {
        this._balanceUsuarioService.setDisponible(res.result.montoDisponible);
        this.disponible.set(res.result.montoDisponible);
      },
      error: (error) => {
        console.error(error);
      }
    });

    this._balanceUsuarioService.disponible$.subscribe(valor => {
      this.disponible.set(valor);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
