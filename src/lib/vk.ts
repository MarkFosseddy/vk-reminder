// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const VK: any;
const VK_API_VERSION = "5.126";

type VKOpenAPI = {
  Auth: VKAuth,
  Api: VKApi,
  Widgets: VKWidgets,
  Observer: VKObserver
};

type VKAuth = {
  login: () => Promise<LoginResponse>,
  logout: () => Promise<LogoutResponse>,
  getLoginStatus: () => Promise<LoginResponse>
};

type VKApi = {
  // @TODO: fix typing
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  call: (method: string, params: Record<string, unknown>) => Promise<ApiCallResponse<any>>,
  getUserInfo: (id: string) => Promise<ApiCallResponse<UserInfo>>
}

type VKWidgets = {
  AllowMessagesFromCommunity: (elementId: string, options: { height: number }, groupId: string) => void
}

type VKObserver = {
  subscribe: (event: string, cb: (res: unknown) => void) => void,
  unsubscribe: (event: string, cb?: (res: unknown) => void) => void
}

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

type ApiCallResponse<T> = {
  error?: {
    error_code: number,
    error_msg: string,
    request_params: Array<{ key: string, value: string }>
  },
  response: T[]
};

type UserInfo = {
  first_name: string,
  id: string,
  last_name: string,
  can_access_closed: boolean,
  is_closed: boolean,
  photo_100: string
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

// @TODO: fix typing
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function call(method: string, params: Record<string, unknown>): Promise<ApiCallResponse<any>> {
  return new Promise(resolve => {
    VK.Api.call(
      method,
      { ...params, v: VK_API_VERSION },
      // @TODO: fix typing
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (res: ApiCallResponse<any>) => resolve(res)
    );
  });
}

function getUserInfo(id: string): Promise<ApiCallResponse<UserInfo>> {
  return call("users.get", { user_ids: id, fields: "photo_100" });
}

const Api: VKApi = {
  call,
  getUserInfo
};

function AllowMessagesFromCommunity(
  elementId: string,
  options: { height: number },
  groupId: string
): void {
  VK.Widgets.AllowMessagesFromCommunity(elementId, options, groupId);
}

const Widgets: VKWidgets = {
  AllowMessagesFromCommunity
};

function subscribe(event: string, cb: (res: unknown) => void): void {
  VK.Observer.subscribe(event, cb);
}

function unsubscribe(event: string, cb?: (res: unknown) => void): void {
  VK.Observer.unsubscribe(event, cb);
}

const Observer: VKObserver = {
  subscribe,
  unsubscribe
}; 

export const VKLib: VKOpenAPI = {
  Auth,
  Api,
  Widgets,
  Observer
};
