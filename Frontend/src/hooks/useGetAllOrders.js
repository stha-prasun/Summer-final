import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "../services/api";
import { setOrders, setLoading, setError } from "../redux/OrderSlice";

export const useGetAllOrders = () => {
  const dispatch = useDispatch();

  const loggedInUser = useSelector((store) => store.User.loggedInUser);
  const {
    items: orders,
    loading,
    error,
  } = useSelector((state) => state.orders);

  useEffect(() => {
    const fetchOrders = async () => {
      dispatch(setLoading(true));
      dispatch(setError(null));
      try {
        const res = await api.get('/orders/all');
        dispatch(setOrders(res.data.orders || []));
      } catch (err) {
        dispatch(
          setError(err.response?.data?.message || "Failed to load orders"),
        );
        dispatch(setOrders([]));
      } finally {
        dispatch(setLoading(false));
      }
    };
    fetchOrders();
  }, [dispatch, loggedInUser]);

  return { orders, loading, error };
};
