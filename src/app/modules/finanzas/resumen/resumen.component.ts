import {ChangeDetectorRef, Component, inject, PLATFORM_ID} from '@angular/core';
import { BalanceUsuario } from 'app/core/models/balance-usuario.model';
import { BalanceUsuarioService } from 'app/core/services-api/balance-usuario.service';
import { Subject, takeUntil } from 'rxjs';
import { ChartModule } from 'primeng/chart';
import {CurrencyPipe, DatePipe, isPlatformBrowser} from '@angular/common';
import { EstadisticasService } from 'app/core/services-api/estadisticas.service';
import { TotalMeses } from 'app/core/models/estadisticas.model';
import { DateFormatsService } from '../servicios/DateFormats.service';

@Component({
  selector: 'app-resumen',
  imports: [ChartModule, CurrencyPipe, DatePipe],
  standalone: true,
  templateUrl: './resumen.component.html',
})
export class ResumenComponent {

  balanceUsuario: BalanceUsuario;

  DataTotalMesesAPI:TotalMeses[]=[];
  DataTotalMeses:any=undefined;
  OptionsTotalMeses:any=undefined;

  platformId = inject(PLATFORM_ID);

  private destroy$ = new Subject<void>();

  constructor(
    private _balanceUsuarioService: BalanceUsuarioService,
    private cd: ChangeDetectorRef,
    private _estadisticasService: EstadisticasService,
    private _dateFormatsService:DateFormatsService
  ) {
    this.balanceUsuario = undefined!;
   }

  ngOnInit(): void {
    this.cargarDataBalanceUsuario();
    this._estadisticasService.getTotalMeses().pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.DataTotalMesesAPI = response.result.data;
          this.initChart();
        },
        error: (error) => {
          console.error('Error al cargar los datos del total por meses:', error);
        }
      });    
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
  initChart() {
    if (isPlatformBrowser(this.platformId)) {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--p-text-color');
      const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
      const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

      const labels = this.DataTotalMesesAPI.map(item => 
        this._dateFormatsService.formatoMesAnio(item.mes));
      const ingresos = this.DataTotalMesesAPI.map(item => item.totalIngresos);
      const gastos = this.DataTotalMesesAPI.map(item => item.totalGastos*-1);

      this.DataTotalMeses = {
        labels: labels,
        datasets: [
          {
            label: 'Ingresos',
            data: ingresos,
            fill: true,
            backgroundColor: [
              'rgba(9, 105, 22, 0.2)'
            ],
            borderColor: ['rgb(5, 46, 12)'],
            borderWidth: 1,
          },
          {
            label: 'Gastos',
            data: gastos,
            fill: true,
            backgroundColor: [
              'rgba(223, 94, 20, 0.2)'
            ],
            borderColor: ['rgb(235, 49, 16)'],
            borderWidth: 1,
          },
        ],
      };

      this.OptionsTotalMeses = {
        plugins: {
          legend: {
            labels: {
              color: textColor,
            },
          },
        },
        scales: {
          x: {
            ticks: {
              color: textColorSecondary,
            },
            grid: {
              color: surfaceBorder,
            },
          },
          y: {
            beginAtZero: true,
            ticks: {
              color: textColorSecondary,
            },
            grid: {
              color: surfaceBorder,
            },
          },
        },
      };
      this.cd.markForCheck()
    }
  }

}
