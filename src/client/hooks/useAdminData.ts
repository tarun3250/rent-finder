import { useState, useEffect, useCallback } from "react";
import api from "../api/api";

export const useAdminData = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [stats, setStats] = useState({ activeUsers: 0, totalRevenue: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [reqsRes, propsRes, statsRes] = await Promise.all([
        api.get("/requests"),
        api.get("/properties"),
        api.get("/admin/stats")
      ]);
      setRequests(reqsRes.data);
      setProperties(propsRes.data);
      setStats(statsRes.data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { requests, properties, stats, loading, error, refetch: fetchData };
};
