import { useState, useEffect } from 'react';
import { fetchProtocols } from '../utils/api';

const useYields = () => {
  const [yields, setYields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchYields = async () => {
      try {
        const response = await fetchProtocols();
        // Transform the protocols data to match the expected yields format
        const protocolsData = response.success ? response.data : [];
        setYields(protocolsData);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch yields:', err);
        setError(err.message);
        setLoading(false);
      }
    };
    fetchYields();
  }, []);

  return { yields, loading, error };
};

export default useYields;