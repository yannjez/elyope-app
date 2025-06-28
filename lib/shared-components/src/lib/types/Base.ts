export type BaseFilter = {
  keyword?: string;
};

export type Option = {
  label: string;
  value: string;
};

export type AppUser = {
  id: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  organizationId: string;
};
