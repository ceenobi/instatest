import { handleError } from "@/utils";
import { useEffect, useMemo, useState } from "react";

export default function useFetch(endpoint, params1, params2) {
  const [getData, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const data = useMemo(() => getData, [getData]);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await endpoint(params1, params2, { signal });
        if (!signal.aborted) {
          setData(res.data);
        }
      } catch (error) {
        if (!signal.aborted) {
          handleError(setError, error);
        }
      } finally {
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    };
    fetchData();
    return () => {
      controller.abort();
    };
  }, [endpoint, params1, params2]);

  return { data, error, loading, setData };
}
