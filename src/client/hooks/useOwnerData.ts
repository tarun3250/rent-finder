import { useState, useEffect, useCallback } from "react";
import api from "../api/api";

export const useOwnerData = (ownerId: number | undefined) => {
  const [properties, setProperties] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!ownerId) return;
    setLoading(true);
    setError(null);
    try {
      const [propsRes, reqsRes] = await Promise.all([
        api.get("/properties", { params: { ownerId } }),
        api.get("/requests/my-requests")
      ]);
      setProperties(propsRes.data);
      setRequests(reqsRes.data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, [ownerId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { properties, requests, loading, error, refetch: fetchData };
};
