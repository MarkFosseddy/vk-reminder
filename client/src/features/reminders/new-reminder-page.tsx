import React from "react";
import { Link } from "react-router-dom";

import { routes } from "../../routing";

export function newReminderPage() {
  return (
    <div>
      <h1>New Reminder Page</h1>
      <Link to={routes.reminders}>Go Back</Link>
    </div>
  );
}
