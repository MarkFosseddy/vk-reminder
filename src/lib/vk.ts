declare const VK: any;
const VK_API_VERSION: string = "5.126";

type VKOpenAPI = {
  Auth: VKAuth,
  Api: VKApi
};

type VKAuth = {
  login: () => Promise<LoginResponse>,
  logout: () => Promise<LogoutResponse>,
  getLoginStatus: () => Promise<LoginResponse>
};

type VKApi = {
  call: (method: string, params: Object) => Promise<ApiCallResponse<any>>,
  getUserInfo: (id: string) => Promise<ApiCallResponse<UserInfo>>
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

function call(method: string, params: Object): Promise<ApiCallResponse<any>> {
  return new Promise(resolve => {
    VK.Api.call(
      method,
      { ...params, v: VK_API_VERSION },
      (res: ApiCallResponse<any>) => resolve(res)
    );
  })
}

function getUserInfo(id: string): Promise<ApiCallResponse<UserInfo>> {
  return call("users.get", { user_ids: id, fields: "photo_100" })
}

const Api: VKApi = {
  call,
  getUserInfo
}

export const VKLib: VKOpenAPI = {
  Auth,
  Api
};
