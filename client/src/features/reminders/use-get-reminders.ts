import React from "react";

import { API } from "../../lib/api";

import { useStoreDispatch, useStoreSelector } from "../../store";
import { useError, useLoading } from "../shared";
import { remindersActions, selectReminders } from "./reminders-slice";

export function useGetReminders() {
  const dispatch = useStoreDispatch();
  const reminders = useStoreSelector(selectReminders);
  const { loading, setLoading } = useLoading();
  const { error, setError } = useError();

  React.useEffect(() => {
    if (reminders != null) return;

    (async () => {
      setLoading(true);
      setError(null);

      const res = await API.reminders.getAll();
      if (res.error) {
        setLoading(false);
        setError("Something went wrong :(");
        return;
      }

      dispatch(remindersActions.setReminders(res.data));
      setLoading(false);
    })();
  }, [dispatch, reminders]);

  return { loading, error, reminders };
}
