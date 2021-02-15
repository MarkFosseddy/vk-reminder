import { API } from "../../lib/api";
import { useStoreDispatch } from "../../store";
import { useError, useLoading } from "../shared";
import { remindersActions } from "./reminders-slice";

export function useCreateReminder() {
  const dispatch = useStoreDispatch();
  const { loading, setLoading } = useLoading();
  const { error, setError } = useError();

  // @TODO: extract type
  async function createReminder({ text, date }: { text: string, date: string }) {
    setError(null);
    setLoading(true);

    const res = await API.reminders.create({ text, date });
    if (res.error) {
      setError("Something went wrong :(");
      setLoading(false);
      return;
    }

    dispatch(remindersActions.add(res.data));
    setLoading(false);
  }

  return { error, loading, createReminder };
}
