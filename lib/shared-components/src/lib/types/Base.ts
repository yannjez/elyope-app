export type BaseFilter = {
  keyword?: string;
};

export type Option = {
  label: string;
  value: string;
};

// Base interface for entities with an id field
export interface BaseEntity {
  id: string;
}

// Helper type for constraining generics to entities with id
export type EntityWithId<T = object> = T & BaseEntity;

export type AppUser = {
  id: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
};
