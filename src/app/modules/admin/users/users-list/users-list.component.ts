import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ApiQuery, ApiSort } from 'app/core/models/query.model';
import { ResponseApiType } from 'app/core/models/response-api.model';
import { User } from 'app/core/models/user.model';
import { UserService } from 'app/core/services-api/user.service';
import { ButtonModule } from 'primeng/button';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-users-list',
  imports: [TableModule, CommonModule, ButtonModule],
  templateUrl: './users-list.component.html',
})
export class UsersListComponent {
  
  usuarios : User[] = [];
  totalRecords = 0;
  
  rowsPerPageOptions: number[] = [];
  rowsDefault = 0;

  loading = false;

  destroy$ = new Subject<void>();

  constructor(
    private _userService: UserService,
  ){
    this.rowsPerPageOptions = [10, 20, 50, 100]
    this.rowsDefault = this.rowsPerPageOptions[0];
  }

  ngOnInit():void{
    
  }

  ngOnDestroy():void{
    this.destroy$.next();
    this.destroy$.complete();
  }

  getUsersData(event: TableLazyLoadEvent):void{
    
    this.loading = true;

    const page = (event.first ?? 0) / (event.rows ?? 10) + 1;
    const perPage = event.rows ?? 10;

    const query: ApiQuery = {
      filters: [], // Más adelante puedes llenar con filtros
      sorter: typeof event.sortField === 'string'
      ? [{
          field: event.sortField,
          order: event.sortOrder === 1 ? 'ASC' : 'DESC',
        }]
      : [],
      pagination: {
        perPage,
        currentPage: page,
      },
    };

    this._userService.getDataUsers(query)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: ResponseApiType<User>)=>{
          this.usuarios = res.result.data;
          this.totalRecords = res.result.pagination.totalItems;
          this.loading = false;          
        },
        error: (error)=> {
          this.usuarios=[];
          this.totalRecords = 0;
          this.loading = false;
        }
      });
  }
  
}
