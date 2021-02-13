import mock from "../../features/reminders/mock.json";
import { Reminder } from "../../features/reminders/reminders-slice";
import { ResultError, ResultSuccess } from "../../types";

function fakeRequest<T>(data: T): Promise<T> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const val = Math.floor(Math.random() * 10);

      if (val > 2) {
        resolve(data);
      } else {
        reject(new Error("test error"));
      }
    }, 500);
  });
}

export async function getAll() {
  try {
    const res = await fakeRequest<{ data: Reminder[] }>(mock);
    return res as ResultSuccess<Reminder[]>;
  } catch (error) {
    const err: Error = error;
    return { error: err.message } as ResultError;
  }
}
