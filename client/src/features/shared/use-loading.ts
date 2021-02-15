import React from "react";

export function useLoading(initValue = false) {
  const [loading, setLoading] = React.useState(initValue);

  return { loading, setLoading };
}
