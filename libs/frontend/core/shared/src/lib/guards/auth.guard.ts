import { inject } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";
import { IamAuth } from "../iam-auth/iam-auth";


export const isUserAuthenticated: CanActivateFn =
  (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const authService = inject(IamAuth);
    const router = inject(Router);
    const snackbar = inject(MatSnackBar);
    // const messagesService = inject(MessagesService);

    if (authService.isLoggedIn()) {
      return true;
    }
    else {

      // messagesService.showMessage(
      //   "Log in first",
      //   "warning"
      // )

      snackbar.open('Please Log in first', 'Close', {
        verticalPosition: 'top',
        horizontalPosition: 'right',
      });
     return router.parseUrl('/home')
    }
  }
