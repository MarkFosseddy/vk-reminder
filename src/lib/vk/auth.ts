// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const VK: any;

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
  sig: string
}

type Connected = "connected";
type NotAuthorized = "not_authorized";
type Unknown = "unknown";
type Status = Connected | NotAuthorized | Unknown;

type LoginResponse = {
  session: Session & { user: User } | null,
  status: Status
};

type LoginStatusResponse = {
  session: Session | null,
  status: Status
}

type LogoutResponse = {
  session: null,
  status: Unknown
}

export function login(): Promise<LoginResponse> {
  return new Promise(resolve => {
    VK.Auth.login((res: LoginResponse) => resolve(res));
  });
}

export function logout(): Promise<LogoutResponse> {
  return new Promise(resolve => {
    VK.Auth.logout((res: LogoutResponse) => resolve(res));
  });
}

export function getLoginStatus(): Promise<LoginStatusResponse> {
  return new Promise(resolve => {
    VK.Auth.getLoginStatus((res: LoginStatusResponse) => resolve(res));
  });
}
