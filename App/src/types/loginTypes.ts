export interface LoginPayload {
  email: string;
  password: string;
}

export interface SessionDetails {
  id: string;
  device?: string;
  expiresAt?: string;
}

export interface UserDetails {
  id: string;
  email: string;
  name: string;
  username: string;
  createdAt?: string;
}

export interface LoginResponse {
  data: {
    accessToken: string;
    user: UserDetails;
    sessions?: SessionDetails[];
  };
  message?: string;
}

export interface AuthLoginState {
  // state
  user: UserDetails | null;
  sessions: SessionDetails[];
  accessToken: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;

  // actions
  login: (payload: LoginPayload) => Promise<boolean>;
  logout: () => Promise<void>;
  loadFromStorage: () => Promise<void>;
}
