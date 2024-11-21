import { useState, useEffect } from "react";

export default function useError(err) {
  const [error, setError] = useState(null);

  useEffect(() => {
    if (err?.message === "Network Error") {
      setError("Server is down, pls wait a bit and reload");
    } else if (err?.response) {
      setError(
        err.response.data?.message ||
          err.response.data?.error ||
          err?.message ||
          "An unexpected error occured"
      );
    } else {
      setError(null);
    }
  }, [err]);

  return [error, setError];
}
