import React from "react";
import { Link } from "react-router-dom";

import { routes } from "../../routing";

import { Reminder } from "./reminders-slice";

import { useLogout } from "../auth";
import { useGetReminders } from "./use-get-reminders";
import { useDeleteReminder } from "./use-delete-reminder";

export function RemindersPage() {
  const { error, reminders } = useGetReminders();
  const { logout } = useLogout();

  if (error) {
    return (
      <div>
        <p>There was an error: </p>
        <p>{error}</p>
      </div>
    );
  }

  if (reminders == null) {
    return (
      <div>LOADING... reminders-page.tsx</div>
    );
  }

  return (
    <div>
      <h1>Reminders Page</h1>

      <button onClick={logout}>
        Logout
      </button>

      <Link to={routes.createReminder}>Create Reminder</Link>

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
  const { loading, error, deleteReminder } = useDeleteReminder();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <li style={{marginTop: 10}}>
      <h4 style={{ textDecoration: reminder.isSent ? "line-through" : "none" }}>
        {reminder.text}
      </h4>
      <p>{reminder.date}</p>
      <button onClick={() => deleteReminder(reminder.id)}>
        delete
      </button>
      <Link to={routes.updateReminder + reminder.id}>update</Link>
    </li>
  );
}
