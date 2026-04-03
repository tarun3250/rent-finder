import { useState, useEffect, useCallback } from "react";
import api from "../api/api";

export const useAdminData = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [reqsRes, propsRes] = await Promise.all([
        api.get("/requests"),
        api.get("/properties")
      ]);
      setRequests(reqsRes.data);
      setProperties(propsRes.data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { requests, properties, loading, error, refetch: fetchData };
};
