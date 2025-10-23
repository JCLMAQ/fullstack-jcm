import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiConfig } from '../api-config/api-config';

@Injectable({
  providedIn: 'root'
})
export class AvatarBase64 {

  private http = inject(HttpClient);
  private apiConfig = inject(ApiConfig);

  uploadAvatarBase64(base64Data: string): Observable<{message: string}> {
    const url = `${this.apiConfig.getApiUrl()}/api/avatar-base64/upload`;
    console.log('🔍 Sending to URL:', url);
    console.log('📊 Data length:', base64Data.length);
    console.log('🏷️ Data preview:', base64Data.substring(0, 100));
    return this.http.post<{message: string}>(url, { base64Data });
  }

  // Méthode de test
  testEndpoint(testData: Record<string, unknown>): Observable<Record<string, unknown>> {
    const url = `${this.apiConfig.getApiUrl()}/api/avatar-base64/test`;
    console.log('🧪 Testing endpoint:', url);
    return this.http.post<Record<string, unknown>>(url, testData);
  }

  getCurrentAvatar(): Observable<{ avatarData: string | null }> {
    const url = `${this.apiConfig.getApiUrl()}/api/avatar-base64/current`;
    return this.http.get<{ avatarData: string | null }>(url);
  }

}
