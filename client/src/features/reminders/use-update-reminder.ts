import { API } from "../../lib/api";
import { useStoreDispatch } from "../../store";
import { useError, useLoading } from "../shared";
import { remindersActions } from "./reminders-slice";

export function useUpdateReminder() {
  const dispatch = useStoreDispatch();
  const { loading, setLoading } = useLoading();
  const { error, setError } = useError();

  // @TODO: typing
  async function updateReminder({ id, text, date }: { id: string, text: string, date: string }) {
    setLoading(true);
    setError(null);

    const res = await API.reminders.update({ id, text, date });
    if (res.error) {
      setError("Something went wrong :(");
      setLoading(false);
      return;
    }

    dispatch(remindersActions.update({ id, text, date }));

    setLoading(false);
  }

  return { loading, error, updateReminder };
}
