import { useState, useEffect } from 'react';
import { PortalData } from '../types';

export function usePortalData(phone: string | null) {
  const [data, setData] = useState<PortalData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async (phoneNumber: string) => {
    setLoading(true);
    setError(null);
    try {
      const scriptUrl = import.meta.env.VITE_GOOGLE_SCRIPT_URL;
      if (!scriptUrl) {
        throw new Error('Google Script URL not configured in .env');
      }

      const url = `${scriptUrl}?phone=${phoneNumber}&t=${Date.now()}`;
      
      const response = await fetch(url);
      const responseText = await response.text();

      if (!response.ok) {
        let errorMsg = `Server error: ${response.status} ${response.statusText}`;
        if (responseText.includes('Script function not found')) {
            errorMsg = "Backend Error: 'doGet' function missing or deployment issue. Please check Apps Script.";
        }
        throw new Error(errorMsg);
      }

      let rawDb;
      try {
        rawDb = JSON.parse(responseText);
      } catch (e) {
        throw new Error("Invalid JSON response from Hrita Cloud. See console for details.");
      }

      // Transform raw sheet data into PortalData structure
      const transformedData: PortalData = {
        user: {
            name: "Premium Client",
            phoneNumber: phoneNumber,
            role: 'client'
        },
        opportunities: rawDb.Opportunities || [],
        invoices: rawDb.Invoices || [],
        payments: rawDb.Payments || [],
        documents: rawDb.OtherDocuments || [],
        consultations: rawDb.ConsultationSession || []
      };

      // Helper to safely compare phone numbers (handles numbers/strings)
      const isMatch = (dbPhone: any, queryPhone: string) => {
        if (!dbPhone) return false;
        return String(dbPhone).trim() === queryPhone.trim();
      };

      // Determine user details and role
      const hritaUser = (rawDb.HritaUsers || []).find((u: any) => isMatch(u.phone_number, phoneNumber));
      const normalUser = (rawDb.Users || []).find((u: any) => isMatch(u.phone_number, phoneNumber));

      if (hritaUser) {
        transformedData.user = {
            name: hritaUser.name || "Hrita Admin",
            phoneNumber: phoneNumber,
            role: 'admin'
        };
        // Admins see all clients from the Users sheet
        transformedData.allClients = (rawDb.Users || []).map((u: any) => ({
            name: u.name || "Unnamed Client",
            phoneNumber: String(u.phone_number),
            role: 'client',
            currentStage: u.current_stage || u.status || 'Lead Collected',
            lastUpdate: u.last_update || 'Recently'
        }));
      } else if (normalUser) {
        transformedData.user = {
            name: normalUser.name || "Premium Client",
            phoneNumber: phoneNumber,
            role: 'client',
            currentStage: normalUser.current_stage || normalUser.status || 'Lead Collected',
            lastUpdate: normalUser.last_update || 'Recently'
        };
      }

      setData(transformedData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (phone) {
      fetchData(phone);
    } else {
      setData(null);
    }
  }, [phone]);

  return { data, loading, error, refetch: () => phone && fetchData(phone) };
}
