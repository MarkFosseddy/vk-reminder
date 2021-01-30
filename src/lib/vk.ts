declare const VK: any;

type VKOpenAPI = {
  Auth: VKAuth
};

type VKAuth = {
  login: () => Promise<LoginResponse>,
  logout: () => Promise<LogoutResponse>,
  getLoginStatus: () => Promise<LoginResponse>
};

type User = {
  domain: string,
  first_name: string,
  href: string,
  id: string,
  last_name: string,
  nickname?: string
}

type Session = {
  expire: number,
  mid: string,
  secret: string,
  sid: string,
  sig: string,
  user: User
};

type Connected = "connected";
type NotAuthorized = "not_authorized";
type Unknown = "unknown";
type Status = Connected | NotAuthorized | Unknown;

type LoginResponse = {
  session: Session | null,
  status: Status
};

type LogoutResponse = {
  session: null,
  status: Unknown,
  settings: undefined
};

function login(): Promise<LoginResponse> {
  return new Promise(resolve => {
    VK.Auth.login((res: LoginResponse) => resolve(res));
  });
}

function logout(): Promise<LogoutResponse> {
  return new Promise(resolve => {
    VK.Auth.logout((res: LogoutResponse) => resolve(res));
  });
}

function getLoginStatus(): Promise<LoginResponse> {
  return new Promise(resolve => {
    VK.Auth.getLoginStatus((res: LoginResponse) => resolve(res));
  });
}

const Auth: VKAuth = {
  login,
  logout,
  getLoginStatus
};

export const VKLib: VKOpenAPI = {
  Auth
};
