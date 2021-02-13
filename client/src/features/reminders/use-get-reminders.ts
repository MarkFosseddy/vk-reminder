import React from "react";

import { API } from "../../lib/api";

import { useStoreDispatch } from "../../store";
import { remindersActions } from "./reminders-slice";

export function useGetReminders() {
  const dispatch = useStoreDispatch();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
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
  }, [dispatch]);

  return { loading, error };
}
