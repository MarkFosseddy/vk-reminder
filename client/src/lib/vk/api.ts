// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const VK: any;

const VK_API_VERSION = "5.126";

type ApiCallError = {
  error_code: number,
  error_msg: string,
  request_params: Array<{ key: string, value: string }>
}

type ApiCallResponse<T> = {
  error?: ApiCallError,
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


export function call<T>(method: string, params: Record<string, unknown>): Promise<ApiCallResponse<T>> {
  return new Promise(resolve => {
    VK.Api.call(
      method,
      { ...params, v: VK_API_VERSION },
      (res: ApiCallResponse<T>) => resolve(res)
    );
  });
}

export function getUserInfo(id: string): Promise<ApiCallResponse<UserInfo>> {
  return call("users.get", { user_ids: id, fields: "photo_100" });
}
