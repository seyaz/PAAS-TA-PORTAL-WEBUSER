import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {CommonService} from '../common/common.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private common: CommonService, private router: Router) {

  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {


    if (this.common.getToken() != null) {
      return true;
    } else {
      this.router.navigate(['/']);
      // this.common.signOut();

    }

    if (this.common.getSessionTime() == null || JSON.parse(this.common.getSessionTime()) < new Date().getTime()) {
      this.router.navigate(['/']);
      // this.common.signOut();
    } else {
      this.common.refreshSession();
    }

    // this.router.navigate(['/login'], {queryParams: {returnUrl: state.url}});
    return false;
  }
}
