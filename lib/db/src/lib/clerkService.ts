import { ClerkUser, ExternalUSer } from 'src/type/userTypes.js';

export class ClerkService {
  baseURl = 'https://api.clerk.com/v1';

  getUsersByIDs = async (ids: string[]) => {
    const url = new URL(`${this.baseURl}/users`);
    url.searchParams.set('user_ids', ids.join(','));
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      },
    };

    try {
      const response = await fetch(url, {
        ...options,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Clerk getUsersByIDs API error:', errorData);
        throw new Error(
          `Clerk getUsersByIDs API error: ${response.status} ${response.statusText}`
        );
      }

      return response.json() as Promise<ClerkUser[]>;
    } catch (error) {
      console.error(error);
      return [] as ClerkUser[];
    }
  };

  getUserByID = async (id: string) => {
    const users = await this.getUsersByIDs([id]);
    return users?.at(0) as ClerkUser;
  };

  getUserByEmail = async (email: string) => {
    const url = new URL(`${this.baseURl}/users`);
    url.searchParams.set('email_address', email);
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      },
    };

    const response = await fetch(url, {
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Clerk getUserByEmail API error:', errorData);
      throw new Error(
        `Clerk getUserByEmail API error: ${response.status} ${response.statusText}`
      );
    }
    const data = await response.json();

    return data?.at(0) as ClerkUser;
  };
  createUser = async (user: ExternalUSer) => {
    const url = new URL(`${this.baseURl}/users`);

    // Parse the name into first and last name

    const firstName = user.firstName || '';
    const lastName = user.lastName || '';

    const userData = {
      email_address: [user.email],
      first_name: firstName,
      last_name: lastName,
      password: null, // We'll let Clerk handle password creation
      skip_password_requirement: true, // Skip password requirement for now
      skip_password_checks: true, // Skip password checks
    };

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      },
      body: JSON.stringify(userData),
    };

    try {
      const response = await fetch(url, options);
      console.log('response', response);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Clerk createUser API error:', errorData);
        throw new Error(
          `Clerk createUser API error: ${response.status} ${response.statusText}`
        );
      }

      const createdUser = (await response.json()) as ClerkUser;
      return createdUser as ClerkUser;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  };

  inviteUser = async (email: string) => {
    const url = new URL(`${this.baseURl}/invitations`);
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      },
      body: JSON.stringify({
        email_address: email,
        redirect_url: 'http://localhost:3000/auth/callback',
      }),
    };
    console.log('options inviteUser', options);
    const response = await fetch(url, options);
    console.log('response inviteUser', response);
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Clerk inviteUser API error:', errorData);
      throw new Error(
        `Clerk inviteUser API error: ${response.status} ${response.statusText}`
      );
    }
  };
}
