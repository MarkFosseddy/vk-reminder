import React from "react";

import { API } from "../../lib/api";

import { useStoreDispatch } from "../../store";
import { remindersActions } from "./reminders-slice";

export function useDeleteReminder() {
  const dispatch = useStoreDispatch();

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

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
