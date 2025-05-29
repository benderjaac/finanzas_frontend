import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ResponseApiType } from 'app/core/models/response-api.model';
import { User } from 'app/core/models/user.model';
import { UserService } from 'app/core/services-api/user.service';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-users-list',
  imports: [TableModule, CommonModule, ButtonModule],
  templateUrl: './users-list.component.html',
})
export class UsersListComponent {
  
  usuarios : User[] = [];

  destroy$ = new Subject<void>();

  constructor(
    private _userService: UserService,
  ){

  }

  ngOnInit():void{
    this._userService.getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: ResponseApiType<User>) =>{
          this.usuarios = response.data;
        },
        error: () =>{

        }
      });
  }

  ngOnDestroy():void{
    this.destroy$.next();
    this.destroy$.complete();
  }
  
}
