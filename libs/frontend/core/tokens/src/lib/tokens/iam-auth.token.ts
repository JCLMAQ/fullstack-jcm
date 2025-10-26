import { InjectionToken } from '@angular/core';
import { IamAuth } from '@fe/shared';

export const IAM_AUTH_TOKEN = new InjectionToken<IamAuth>(
  'IAM_AUTH_TOKEN',
);
