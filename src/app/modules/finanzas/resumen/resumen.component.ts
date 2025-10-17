import {ChangeDetectorRef, Component, inject, PLATFORM_ID} from '@angular/core';
import { BalanceUsuario } from 'app/core/models/balance-usuario.model';
import { BalanceUsuarioService } from 'app/core/services-api/balance-usuario.service';
import { Subject, takeUntil } from 'rxjs';
import { ChartModule } from 'primeng/chart';
import {CurrencyPipe, DatePipe, isPlatformBrowser} from '@angular/common';
import { EstadisticasService } from 'app/core/services-api/estadisticas.service';
import { TotalMeses } from 'app/core/models/estadisticas.model';
import { DateFormatsService } from '../servicios/DateFormats.service';
import { Movimiento } from 'app/core/models/movimiento.model';

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

  DataGastosAcumuladosAPI:Movimiento[]=[];
  DataGastosAcumulados:any=undefined;
  OptionsGastosAcumulados:any=undefined;

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
          this.initChartTotalesMes();
        },
        error: (error) => {
          console.error('Error al cargar los datos del total por meses:', error);
        }
      });    

      this._estadisticasService.getGastosAcumulados().pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.DataGastosAcumuladosAPI = response.result.data;
          this.initChartGastosAcumulados();
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
  initChartTotalesMes() {
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

  initChartGastosAcumulados() {
    if (isPlatformBrowser(this.platformId)) {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--p-text-color');
      const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
      const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

      const labels = Array.from({ length: 31 }, (_, i) => (i + 1).toString());

      const mesesUnicos = Array.from(
        new Set(
          this.DataGastosAcumuladosAPI.map(d => d.fecha.slice(0, 7)) // formato 'YYYY-MM'
        )
      ).sort();

      const [preanteriorMes, anteriorMes, actualMes] = mesesUnicos.slice(-3);

      const preanterior = preanteriorMes ? this.obtenerAcumuladoPorMes(preanteriorMes) : Array(31).fill(0);
      const anterior = anteriorMes ? this.obtenerAcumuladoPorMes(anteriorMes) : Array(31).fill(0);
      const actual = actualMes ? this.obtenerAcumuladoPorMes(actualMes) : Array(31).fill(0);
      
      this.DataGastosAcumuladosAPI
      
      
      this.DataGastosAcumulados = {
        labels: labels,
        datasets: [
          {
            label: 'Actual',
            data: actual,
            fill: true,
            backgroundColor: [
              'rgba(28, 30, 150, 0.37)'
            ],
            borderColor: ['rgb(15, 13, 131)'],
            borderWidth: 1,
          },
          {
            label: 'Anterior',
            data: anterior,
            fill: true,
            backgroundColor: [
              'rgba(78, 180, 124, 0.36)'
            ],
            borderColor: ['rgb(29, 124, 68)'],
            borderWidth: 1,
          },
          {
            label: 'Preanterior',
            data: preanterior,
            fill: true,
            backgroundColor: [
              'rgba(196, 226, 25, 0.37)'
            ],
            borderColor: ['rgb(205, 219, 4)'],
            borderWidth: 1,
          },
        ],
      };

      this.OptionsGastosAcumulados = {
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

  obtenerAcumuladoPorMes(mes: string): number[] {
    const arr = Array(31).fill(0);
  
    // Filtrar datos del mes
    const movimientosMes = this.DataGastosAcumuladosAPI.filter(d => d.fecha.startsWith(mes));
  
    // Sumar día por día
    for (const mov of movimientosMes) {
      const dia = parseInt(mov.fecha.slice(8, 10)); // '2025-07-01' → 1
      arr[dia - 1] += mov.monto; // Sumar monto del día
    }
  
    // Convertir a acumulado progresivo
    for (let i = 1; i < arr.length; i++) {
      arr[i] += arr[i - 1];
    }
  
    return arr;
  }

}
