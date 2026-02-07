import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

const SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL;

export function usePortalData(phoneNumber: string | null) {
  const [portalData, setPortalData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    if (!phoneNumber) return;
    setLoading(true);
    try {
      const response = await fetch(`${SCRIPT_URL}?action=getData&phone_number=${phoneNumber}`);
      const result = await response.json();
      if (result.status === 'success') {
        setPortalData(result.data);
      } else {
        toast.error(result.message || "Error loading data");
      }
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  }, [phoneNumber]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { portalData, loading, refetch: fetchData };
}