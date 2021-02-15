import React from "react";

import { API } from "../../lib/api";

import { useStoreDispatch } from "../../store";
import { remindersActions } from "./reminders-slice";

export function useCreateReminder() {
  const dispatch = useStoreDispatch();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

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
