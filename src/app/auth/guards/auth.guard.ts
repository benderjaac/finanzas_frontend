import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { inject } from '@angular/core';
import { map, of } from 'rxjs';

export const AuthGuard: CanActivateFn | CanActivateChildFn = (route, state) => {
  
  const _authService = inject(AuthService);
  const router: Router = inject(Router);
  
  if(!_authService._authenticated()){

    return _authService.checkToken().pipe(
      map((isValid) => {
        if (isValid) {
          return true;
        }
        const redirectURL = state.url === '/sign-out' ? '' : `redirectURL=${state.url}`;
        return router.parseUrl(`sign-in?${redirectURL}`);
      })
    );
  }
  return of(true);  
};
