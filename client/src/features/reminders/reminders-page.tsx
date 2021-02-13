import React from "react";
import { useStoreSelector } from "../../store";
import { useLogout } from "../auth";
import { Reminder, selectReminders } from "./reminders-slice";
import { useGetReminders } from "./use-get-reminders";

export function RemindersPage() {
  const { loading, error } = useGetReminders();
  const { logout } = useLogout();
  const reminders = useStoreSelector(selectReminders);

  if (loading) {
    return (
      <div>LOADING... reminders-page.tsx</div>
    );
  }

  if (error) {
    return (
      <div>
        <p>There was an error: </p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Reminders Page</h1>

      <button onClick={logout}>
        Logout
      </button>

      {reminders.length > 0
        ? <ReminderList reminders={reminders} />
        : <div>You have no reminders</div>
      }
    </div>
  );
}

function ReminderList({ reminders }: { reminders: Reminder[] }) {
  return (
    <ul>
      {reminders.map(reminder => <ReminderItem key={reminder.id} reminder={reminder} />)}
    </ul>
  );
}

function ReminderItem({ reminder }: { reminder: Reminder }) {
  return (
    <li style={{marginTop: 10}}>
      <h4 style={{ textDecoration: reminder.isSent ? "line-through" : "none" }}>
        {reminder.text}
      </h4>
      <p>{reminder.date}</p>
      <button>delete</button>
      <button>update</button>
    </li>
  );
}
