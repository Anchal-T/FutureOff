import { useState, useEffect } from 'react';
import axios from 'axios';
import { BACKEND_API_URL } from '../utils/constants';

const usePositions = () => {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const response = await axios.get(`${BACKEND_API_URL}/api/positions`);
        setPositions(response.data); // Example: [{ id: '1', protocol: 'Aave', amount: '1.5' }, ...]
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchPositions();
  }, []);

  return { positions, loading, error };
};

export default usePositions;