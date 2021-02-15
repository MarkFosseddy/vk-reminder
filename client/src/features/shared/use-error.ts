import React from "react";

export function useError(initValue: string | null = null) {
  const [error, setError] = React.useState(initValue);

  return { error, setError };
}
