import { ClerkUser, ExternalUSer } from 'src/type/userTypes.js';

export type ClerkSortField =
  | 'created_at'
  | '-created_at'
  | 'updated_at'
  | '-updated_at'
  | 'email_address'
  | 'first_name'
  | '-first_name'
  | 'last_name'
  | '-last_name'
  | 'username'
  | '-username'
  | 'last_active_at'
  | '-last_active_at'
  | 'last_sign_in_at'
  | '-last_sign_in_at';

export class ClerkService {
  baseURl = 'https://api.clerk.com/v1';

  /**
   * Get users with pagination and ordering
   * @param limit - Number of users to return (1-500, default 10)
   * @param offset - Number of users to skip (default 0)
   * @param orderBy - Order by field with +/- prefix (default "-created_at")
   * @returns Promise with array of users
   */
  getUsers = async (
    limit: number = 10,
    offset: number = 0,
    sortField?: ClerkSortField,
    keyword?: string,
    userIds?: string[]
  ): Promise<ClerkUser[]> => {
    const url = new URL(`${this.baseURl}/users`);
    url.searchParams.set('limit', limit.toString());
    url.searchParams.set('offset', offset.toString());
    if (sortField) {
      url.searchParams.set('order_by', sortField);
    }
    if (keyword) {
      url.searchParams.set('query', keyword);
    }

    if (userIds && userIds.length > 0) {
      url.searchParams.set('user_id', userIds.join(','));
    }
    console.log('url', url.searchParams.toString());

    return this.baseFetch<ClerkUser[]>('/users?' + url.searchParams.toString());
  };

  /**
   * Get users by their IDs
   * @param ids - Array of user IDs
   * @param keyword - Optional search keyword
   * @returns Promise with array of users
   */
  getUsersByIDs = async (
    ids: string[],
    keyword?: string
  ): Promise<ClerkUser[]> => {
    const url = new URL(`${this.baseURl}/users`);

    if (ids.length > 0) {
      url.searchParams.set('user_ids', ids.join(','));
    }

    return this.baseFetch<ClerkUser[]>('/users?' + url.searchParams.toString());
  };

  /**
   * Get a single user by ID
   * @param id - User ID
   * @returns Promise with user data or null
   */
  getUserByID = async (id: string): Promise<ClerkUser | null> => {
    const users = await this.getUsersByIDs([id]);
    return users?.at(0) || null;
  };

  /**
   * Get a user by email address
   * @param email - Email address to search for
   * @returns Promise with user data or null
   */
  getUserByEmail = async (email: string): Promise<ClerkUser | null> => {
    const url = new URL(`${this.baseURl}/users`);
    url.searchParams.set('email_address', email);

    const users = await this.baseFetch<ClerkUser[]>(
      '/users?' + url.searchParams.toString()
    );
    return users?.at(0) || null;
  };

  /**
   * Create a new user
   * @param user - User data to create
   * @returns Promise with created user data
   */
  createUser = async (user: ExternalUSer): Promise<ClerkUser> => {
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';

    const userData = {
      email_address: [user.email],
      first_name: firstName,
      last_name: lastName,
      password: null,
      skip_password_requirement: true,
      skip_password_checks: true,
    };

    return this.baseFetch<ClerkUser>('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  };

  /**
   * Invite a user by email
   * @param email - Email address to invite
   * @returns Promise with invitation data
   */
  inviteUser = async (email: string): Promise<any> => {
    const invitationData = {
      email_address: email,
      redirect_url: 'http://localhost:3000/auth/callback',
    };

    return this.baseFetch<any>('/invitations', {
      method: 'POST',
      body: JSON.stringify(invitationData),
    });
  };

  deleteUserByID = async (id: string): Promise<any> => {
    return this.baseFetch<any>(`/users/${id}`, {
      method: 'DELETE',
    });
  };

  /**
   * Base fetch function for making API calls to Clerk
   * @param endpoint - The API endpoint (without base URL)
   * @param options - Fetch options (method, body, etc.)
   * @returns Promise with the response data
   */
  private async baseFetch<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = new URL(`${this.baseURl}${endpoint}`);
    console.log('url', url.toString());

    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      },
      ...options,
    };

    try {
      const response = await fetch(url, defaultOptions);

      if (!response.ok) {
        const errorData = await response.json();
        console.error(`Clerk API error for ${endpoint}:`, errorData);
        throw new Error(
          `Clerk API error: ${response.status} ${response.statusText}`
        );
      }

      return response.json() as Promise<T>;
    } catch (error) {
      console.error(`Error in baseFetch for ${endpoint}:`, error);
      throw error;
    }
  }
}
