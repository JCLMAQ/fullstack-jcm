// Définitions de types pour le frontend
// Ces types sont copiés/simplifiés depuis les types Prisma pour éviter les dépendances complexes

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER'
}

export enum Language {
  EN = 'EN',
  FR = 'FR',
  ES = 'ES',
  DE = 'DE'
}

export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR'
}

export enum Title {
  MR = 'MR',
  MRS = 'MRS',
  MS = 'MS',
  DR = 'DR'
}

export interface User {
  id: string;
  email: string;
  lastName?: string;
  firstName?: string;
  nickName?: string;
  title?: Title;
  gender?: Gender;
  language?: Language;
  photoUrl?: string;
  roles?: Role[];
  createdAt: Date;
  updatedAt: Date;
}
