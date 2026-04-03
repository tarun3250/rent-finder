import { useState, useEffect, useCallback } from "react";
import api from "../api/api";
import { Property } from "../types/types";

export const useProperties = (filters: any = {}) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/properties", { params: filters });
      setProperties(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  return { properties, loading, error, refetch: fetchProperties };
};

export const useRecommendations = (profile: any) => {
  const [recommendations, setRecommendations] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRecommendations = useCallback(async () => {
    if (!profile) return;
    setLoading(true);
    try {
      const response = await api.get("/properties/recommendations", {
        params: {
          budget: 100000,
          location: "Mumbai",
          bhk: "2 BHK",
          amenities: ["Parking", "Gym"]
        }
      });
      setRecommendations(response.data);
    } catch (err) {
      console.error("Error fetching recommendations:", err);
    } finally {
      setLoading(false);
    }
  }, [profile?.id]);

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  return { recommendations, loading, refetch: fetchRecommendations };
};
