export type ExternalUSer = {
  id: string;
  email: string;
  name: string;
};

export type UserType = 'VETERINARIAN' | 'ADMIN' | 'INTERPRETER';

export type User = {
  id: string;
  externalId: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  roles: UserType[];
};
