// src/app/guards.ts
import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, CanDeactivateFn, CanMatchFn, Route, UrlSegment } from '@angular/router';
import { AuthService } from '../services/authbis.service'; // Simulated auth service
// import { ProductService } from './product.service';  // Simulated product service

// CanActivate Guard (Checking if user is authenticated)
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  return authService.isAuthenticated();
};

// CanMatch Guard: Checks if the user is authenticated before matching the route
export const authCanMatchGuard: CanMatchFn = (route: Route, segments: UrlSegment[]) => {
  const authService = inject(AuthService);
  return authService.isAuthenticated();  // Only match the route if the user is authenticated
};


// CanActivateChild Guard (Checking if user has admin role)
export const adminGuard: CanActivateChildFn = () => {
  const authService = inject(AuthService);
  return authService.hasAdminRole();
};

// CanDeactivate Guard (Checking if form can be deactivated)
export const formGuard: CanDeactivateFn<any> = (component) => {
  return component.canDeactivate ? component.canDeactivate() : true;
};

// Resolve Guard (Fetching product details before activating route)
// export const productResolver: ResolveFn<any> = () => {
//   const productService = inject(ProductService);
//   return productService.getProductDetails();
// };

