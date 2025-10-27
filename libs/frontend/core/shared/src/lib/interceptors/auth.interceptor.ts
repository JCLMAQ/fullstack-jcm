import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { AppStore } from '@fe/stores';
import { Observable } from 'rxjs';

export function AuthInterceptor (request: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
    const authJwtTokenbis = localStorage.getItem('authJwtToken');
    const authJwtToken = inject(AppStore).authToken();

    console.log('🔍 AuthInterceptor - URL:', request.url);
    console.log('🔍 AuthInterceptor - Token from localStorage:', authJwtTokenbis);
    console.log('🔍 AuthInterceptor - Token from AppStore:', authJwtToken);

    if (authJwtToken) {
        const cloned = request.clone({
            headers: request.headers
                .set('Authorization',`Bearer ${authJwtToken}`)
        });
        console.log('✅ Token ajouté à la requête');
        return next(cloned);
    }
    else {
        console.log('❌ Aucun token trouvé');
        return next(request);
    }
}




