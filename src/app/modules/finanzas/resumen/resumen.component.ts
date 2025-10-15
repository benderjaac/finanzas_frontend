import { Component } from '@angular/core';
import { BalanceUsuario } from 'app/core/models/balance-usuario.model';
import { BalanceUsuarioService } from 'app/core/services-api/balance-usuario.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-resumen',
  imports: [],
  templateUrl: './resumen.component.html',
})
export class ResumenComponent {

  balanceUsuario: BalanceUsuario;

  private destroy$ = new Subject<void>();

  constructor(
    private _balanceUsuarioService: BalanceUsuarioService
  ) {
    this.balanceUsuario = undefined!;
   }

  ngOnInit(): void {
    this.cargarDataBalanceUsuario();
  }

  cargarDataBalanceUsuario(): void {
    this._balanceUsuarioService.getDataBalanceUsuario()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.balanceUsuario = response.result;
          this._balanceUsuarioService.setBalance(this.balanceUsuario);
        },
        error: (error) => {
          console.error('Error al cargar los datos del balance de usuario:', error);
        }
      });
  }
}
