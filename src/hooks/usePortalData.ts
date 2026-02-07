import { useState, useEffect } from 'react';
import { PortalData } from '../types';

export function usePortalData(phone: string | null, viewAsRole?: string) {
  const [data, setData] = useState<PortalData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async (phoneNumber: string, role?: string) => {
    setLoading(true);
    setError(null);
    try {
      const scriptUrl = import.meta.env.VITE_GOOGLE_SCRIPT_URL;
      if (!scriptUrl) {
        throw new Error('Google Script URL not configured in .env');
      }

      // Add action=getData
      let url = `${scriptUrl}?action=getData&phone=${phoneNumber}&t=${Date.now()}`;
      if (role) url += `&viewAsRole=${role}`;

      const response = await fetch(url);
      const responseText = await response.text();

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      let rawDb;
      try {
        rawDb = JSON.parse(responseText);
      } catch (e) {
        console.error("JSON Parse Error:", responseText);
        throw new Error("Invalid JSON response from Hrita Cloud.");
      }
      
      if (rawDb.status === 'error') {
          throw new Error(rawDb.message);
      }

      // Transform raw sheet data into PortalData structure
      const transformedData: PortalData = {
        user: {
          name: rawDb.user.name,
          phoneNumber: rawDb.user.phone_number,
          role: rawDb.user.role
        },
        opportunities: rawDb.opportunities || [],
        invoices: rawDb.invoices || [],
        payments: rawDb.payments || [],
        documents: rawDb.documents || [],
        myDocuments: rawDb.myDocuments || [],
        consultations: rawDb.consultations || [],
        allClients: rawDb.allClients || [],
        recents: rawDb.recents || []
      };

      setData(transformedData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (phone) {
      fetchData(phone, viewAsRole);
    } else {
      setData(null);
    }
  }, [phone, viewAsRole]);

  return { data, loading, error, refetch: () => phone && fetchData(phone, viewAsRole) };
}
