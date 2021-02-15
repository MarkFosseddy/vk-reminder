import React from "react";
import { Link, useHistory, useParams, useRouteMatch } from "react-router-dom";

import { routes } from "../../routing";
import { useStoreSelector } from "../../store";
import { selectReminderById } from "./reminders-slice";
import { useCreateReminder } from "./use-create-reminder";
import { useDeleteReminder } from "./use-delete-reminder";
import { useUpdateReminder } from "./use-update-reminder";

export function NewReminderPage() {
  const match = useRouteMatch();
  const params = useParams<{ id: string }>();
  const history = useHistory();

  const isEdit = match.path.includes("update");

  const reminder = useStoreSelector(state => selectReminderById(state, params.id));

  const [text, setText] = React.useState(reminder?.text ?? "");
  const [date, setDate] = React.useState(reminder?.date ?? "");

  const { createReminder } = useCreateReminder();
  const { updateReminder } = useUpdateReminder();
  const { deleteReminder } = useDeleteReminder();

  return (
    <div>
      <h1>New Reminder Page</h1>
      <Link to={routes.reminders}>Go Back</Link>

      <div>
        <input type="text" value={text} onChange={e => setText(e.target.value)} />
        <input type="text" value={date} onChange={e => setDate(e.target.value)} />
      </div>

      <button onClick={async () => {
        if (isEdit) {
          await updateReminder({ id: params.id, text, date });
        } else {
          await createReminder({ text, date });
        }
        history.replace(routes.reminders);
      }}>
        ACTION!
      </button>

      {isEdit &&
        <button onClick={async () => {
          await deleteReminder(params.id);
          history.replace(routes.reminders);
        }}>
          Delete
        </button>
      }
    </div>
  );
}
