// import { IUserLogged } from '@fe/shared';

import { User } from "@db/prisma";

export type AppSlice = {
  readonly user: User | undefined;
    // readonly user: IUserLogged | undefined;
  readonly authToken: string | undefined;
  // readonly selectedLanguage: string;
  // readonly possibleLanguages: string[];
};

export const initialAppSlice: AppSlice = {
  user: undefined,
  authToken: undefined,
  // selectedLanguage: '',
  // possibleLanguages: []
};
