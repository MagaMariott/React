import { useEffect, useState } from "react";

export function useAsync(factory, deps, { keepPrevious = true } = {}) {
  const [state, setState] = useState({
    status: "loading",
    data: null,
    error: "",
  });

  useEffect(() => {
    let active = true;
    setState((current) => ({
      status: keepPrevious && current.data ? "refreshing" : "loading",
      data: keepPrevious ? current.data : null,
      error: "",
    }));

    factory()
      .then((data) => {
        if (!active) return;
        setState({ status: "ready", data, error: "" });
      })
      .catch((error) => {
        if (!active) return;
        setState((current) => ({
          status: "error",
          data: keepPrevious ? current.data : null,
          error: error instanceof Error ? error.message : "Request failed",
        }));
      });

    return () => {
      active = false;
    };
  }, deps);

  return state;
}
