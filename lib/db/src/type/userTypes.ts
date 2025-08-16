export type ExternalUSer = {
  email: string;
  firstName: string;
  lastName: string;
};

export type UserType = 'VETERINARIAN' | 'ADMIN' | 'INTERPRETER';

export type User = {
  id: string;
  externalId: string;
  createdAt: Date;
  updatedAt: Date;
  roles: UserType[];
};

export type FullUser = User &
  ClerkUser & {
    fullName: string;
    email: string;
  };

export type ClerkEmailAddress = {
  id: string;
  email_address: string;
  verification: {
    status: string;
    strategy: string;
  };
};

export type ClerkExternalAccount = {
  id: string;
  object: string;
  provider: string;
  email_address: string;
  provider_user_id: string;
  approved_scopes: string;
  email_verified: boolean;
  created_at: number;
  updated_at: number;
};

export type ClerkUser = {
  id: string;
  object: 'user';
  username: string | null;
  first_name: string;
  last_name: string;
  image_url: string;
  has_image: boolean;
  primary_email_address_id: string;
  primary_phone_number_id: string | null;
  primary_web3_wallet_id: string | null;
  password_enabled: boolean;
  two_factor_enabled: boolean;
  totp_enabled: boolean;
  backup_code_enabled: boolean;
  email_addresses: ClerkEmailAddress[];

  external_accounts: ClerkExternalAccount[];

  external_id: string | null;
  last_sign_in_at: number;
  banned: boolean;
  locked: boolean;
  lockout_expires_in_seconds: number | null;
  verification_attempts_remaining: number;
  created_at: number;
  updated_at: number;
  delete_self_enabled: boolean;
  create_organization_enabled: boolean;
  last_active_at: number;
  mfa_enabled_at: number | null;
  mfa_disabled_at: number | null;
  legal_accepted_at: number | null;
  profile_image_url: string;
};

export type UserInvitation = {
  id: string;
  email: string;
  roles: UserType[];
  status: 'PENDING' | 'ACCEPTED' | 'EXPIRED' | 'CANCELLED';
  token: string;
  expiresAt: string;
  createdAt: string;
  acceptedAt?: string;
  inviter?: {
    id: string;
    externalId: string;
  };
  structure?: {
    id: string;
    name: string;
  };
};
