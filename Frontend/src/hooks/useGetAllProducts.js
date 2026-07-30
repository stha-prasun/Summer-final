import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import api from '../services/api';
import { setProducts, setLoading, setError } from '../redux/productsSlice';

export const useGetAllProducts = (category = 'all') => {
  const dispatch = useDispatch();
  const { items: products, loading, error } = useSelector((state) => state.Products);

  useEffect(() => {
    const fetchProducts = async () => {
      dispatch(setLoading(true));
      dispatch(setError(null));
      try {
        const params = category === 'all' ? {} : { category };
        const res = await api.get('/products', { params });
        dispatch(setProducts(res.data.products || []));
      } catch (err) {
        dispatch(setError(err.response?.data?.message || 'Failed to load products'));
        dispatch(setProducts([]));
      } finally {
        dispatch(setLoading(false));
      }
    };
    fetchProducts();
  }, [category, dispatch]);

  return { products, loading, error };
};
