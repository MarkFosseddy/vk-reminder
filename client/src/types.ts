export enum StorageKeys {
  VK_ID = "vk-id"
}

export type ResultSuccess<T> = {
  data: T,
  error: never
}

export type ResultError = {
  data: never,
  error: string
}
