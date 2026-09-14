export interface RegisterPayload{
    name:String;
    username:string;
    email:string;
    password:string;
}

export interface RegisterResponse{
    message:string;
}

export interface AuthRegisterState {
  isLoading: boolean;
  error: string | null;
  register: (payload: RegisterPayload) => Promise<boolean>;
}