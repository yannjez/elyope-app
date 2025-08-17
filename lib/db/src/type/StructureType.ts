export type Structure = {
  id: string;
  name: string;
  description?: string | null;
  address1?: string | null;
  address2?: string | null;
  zipcode?: string | null;
  town?: string | null;
  phone?: string | null;
  mobile?: string | null;
  account_lastname?: string | null;
  account_firstname?: string | null;
  account_email?: string | null;
  is_structure_active: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
  interpreterId?: string;
};
