import { useState, useEffect } from 'react';
import { PortalData } from '../types';
import { EstimatePhase } from '../types/workflow';
import { db } from '../services/databaseService';

export function usePortalData(phone: string | null) {
  const [data, setData] = useState<PortalData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async (phoneNumber: string) => {
    setLoading(true);
    setError(null);
    try {
      const scriptUrl = import.meta.env.VITE_GOOGLE_SCRIPT_URL;
      console.log("DEBUG: Fetching from scriptUrl:", scriptUrl);
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
        const json = JSON.parse(responseText);
        rawDb = json.success ? json.data : json; // Handle wrapped vs unwrapped
      } catch (e) {
        console.error("DEBUG: Failed to parse JSON. Response was:", responseText);
        throw new Error("Invalid JSON response from Hrita Cloud. See console for details.");
      }

      // Update the singleton DB cache for services that rely on it (like workflowService)
      db.setCloudData(rawDb);

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
        myDocuments: rawDb.MyDocuments || [],
        consultations: rawDb.ConsultationSessions || rawDb.ConsultationSession || [],
        estimates: (rawDb.Estimates || []).map((e: any) => ({
          ...e,
          // DERIVE FRONTEND STATE FROM BACKEND STATUS
          current_phase: derivePhase(e.status),
          phase_status: derivePhaseStatus(e.status)
        }))
      };

      // Helper to map backend status to frontend phase
      function derivePhase(backendStatus: string): EstimatePhase {
        // Normalize
        const status = (backendStatus || '').toUpperCase();
        
        if (status === 'REQUESTED' || status === 'PROCESSING') return EstimatePhase.ESTIMATE_REQUEST;
        if (status === 'PREPARED' || status === 'ESTIMATE_REVIEW') return EstimatePhase.ESTIMATE_REVIEW; // PREPARED = Uploaded
        if (status === 'DESIGN_SUBMITTED' || status === 'DESIGN_REVIEW') return EstimatePhase.DESIGN;
        if (status === 'BOOKING_REQUESTED') return EstimatePhase.BOOKING;
        if (status === 'SHIPPING_REQUESTED') return EstimatePhase.SHIPPING;
        if (status === 'INSTALLATION') return EstimatePhase.INSTALLATION;
        if (status === 'PAYMENT_REQUESTED') return EstimatePhase.POST_INSTALLATION_PAYMENT;
        if (status === 'COMPLETED') return EstimatePhase.COMPLETED;
        
        return EstimatePhase.ESTIMATE_REQUEST; // Default
      }

      function derivePhaseStatus(backendStatus: string): string {
        const status = (backendStatus || '').toUpperCase();
        
        if (status === 'REQUESTED') return 'created'; // User just created it
        if (status === 'PROCESSING') return 'pending'; // Admin is processing
        if (status === 'PREPARED') return 'pending'; // Admin uploaded, waiting for user review
        if (status === 'ESTIMATE_APPROVED') return 'approved';
        
        // Generic mapping
        if (status.includes('APPROVED')) return 'approved';
        if (status.includes('PAID')) return 'paid';
        if (status.includes('COMPLETED')) return 'completed';
        
        return 'pending';
      }

      // Helper to safely compare phone numbers
      const isMatch = (dbPhone: any, queryPhone: string) => {
        if (!dbPhone) return false;
        return String(dbPhone).trim() === queryPhone.trim();
      };

      // Determine user details and role from backend response
      if (rawDb.isHritaUser) {
        // Admin profile
        const hritaProfile = (rawDb.HritaUsers || []).find((u: any) => isMatch(u.phone_number, phoneNumber));
        transformedData.user = {
          name: hritaProfile?.name || "Hrita Admin",
          phoneNumber: phoneNumber,
          role: 'admin'
        };
        // Admins see all clients from the Users sheet
        transformedData.allClients = (rawDb.Users || []).map((u: any) => ({
          name: u.name || "Unnamed Client",
          phoneNumber: String(u.phone_number),
          role: 'client',
          currentStage: u.status || 'Lead Collected',
          lastUpdate: u.updated_datetime || 'Recently'
        }));
      } else {
        // Normal User profile
        if (rawDb.user) {
          transformedData.user = {
            name: rawDb.user.name || "Premium Client",
            phoneNumber: phoneNumber,
            role: 'client',
            currentStage: rawDb.user.status || 'Lead Collected',
            lastUpdate: rawDb.user.updated_datetime || 'Recently'
          };
        }
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
