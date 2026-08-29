import { useEffect, useState } from "react";

// Every analytics tab is "call one endpoint, get one snapshot object back" —
// this avoids repeating the same loading/data useState/useEffect in all
// seven tab components.
export function useAnalyticsSnapshot(fetchFn) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchFn().then((res) => {
      if (!active) return;
      setData(res.data);
      setLoading(false);
    });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { data, loading };
}
