import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { inject } from '@angular/core';
import { of } from 'rxjs';

export const AuthGuard: CanActivateFn | CanActivateChildFn = (route, state) => {
  
  const _authService = inject(AuthService);
  const router: Router = inject(Router);
  
  if(!_authService._authenticated()){
    
    const redirectURL = state.url === '/sign-out' ? '' : `redirectURL=${state.url}`;
    const urlTree = router.parseUrl(`sign-in?${redirectURL}`);
    return of(urlTree);

  }
  return of(true);  
};
