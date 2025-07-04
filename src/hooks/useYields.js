import { useState, useEffect } from 'react';
import axios from 'axios';
import { BACKEND_API_URL } from '../utils/constants';

const useYields = () => {
  const [yields, setYields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchYields = async () => {
      try {
        const response = await axios.get(`${BACKEND_API_URL}/api/yields`);
        setYields(response.data); // Example: [{ id: 'aave', name: 'Aave', apy: 5.2 }, ...]
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchYields();
  }, []);

  return { yields, loading, error };
};

export default useYields;