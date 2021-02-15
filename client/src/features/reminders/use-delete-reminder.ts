import { API } from "../../lib/api";
import { useStoreDispatch } from "../../store";
import { useError, useLoading } from "../shared";
import { remindersActions } from "./reminders-slice";

export function useDeleteReminder() {
  const dispatch = useStoreDispatch();

  const { loading, setLoading } = useLoading();
  const { error, setError } = useError();

  async function deleteReminder(id: string) {
    setLoading(true);
    setError(null);

    const res = await API.reminders.deleteReminder(id);
    if (res.error) {
      setError("Something went wrong :(");
      setLoading(false);
      return;
    }

    setLoading(false);
    dispatch(remindersActions.deleteReminder(id));
  }

  return { loading, error, deleteReminder };
}
