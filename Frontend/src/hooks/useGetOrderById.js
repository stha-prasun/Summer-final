import { useEffect, useState } from "react";
import api from "../services/api";

export const useGetOrderById = (id) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetchOrder = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/orders/${id}`);
        if (!cancelled) {
          setOrder(res.data.order || null);
          if (!res.data.success) {
            setError(res.data.message || "Failed to load order");
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.message || "Failed to load order");
          setOrder(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    if (id) fetchOrder();
    return () => {
      cancelled = true;
    };
  }, [id]);

  return { order, loading, error };
};
