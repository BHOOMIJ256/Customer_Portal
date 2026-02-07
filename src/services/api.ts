export interface User {
  phone_number: string;
  name: string;
  role: 'admin' | 'client';
}

export interface Estimate {
  id: string;
  phone_number: string;
  city: string;
  property_type: string;
  bhk: string;
  square_feat: number;
  layout_url: string;
  wiring_done: string;
  possession_status: string;
  service_required: string;
  status: 'pending' | 'created' | 'changes requested' | 'approved';
  document_id?: string;
  estimate_viewers?: string;
}

export interface Design {
  id: string;
  estimate_id: string;
  phone_number: string;
  subject: string;
  description: string;
  document_id: string;
  status: 'pending' | 'changes requested' | 'approved';
  design_viewers?: string;
}

export interface Opportunity {
  id: string;
  estimate_id: string;
  phone_number: string;
  booking_status: 'pending' | 'verified';
  shipping_status: 'pending' | 'verified';
  installation_status: 'pending' | 'completed';
  post_install_payment_status: 'pending' | 'verified';
}

export interface RecentAction {
  subject: string;
  description?: string;
  status: string;
  action: string;
  client?: string;
}

const SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL;

async function apiCall(body: any) {
  try {
    const actionUrl = `${SCRIPT_URL}?action=${body.action}`;
    const response = await fetch(actionUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify(body),
    });
    if (!response.ok) throw new Error(`Status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

export const hritaApi = {
  getDashboard: (phone: string) => apiCall({ action: 'getData', phone_number: phone }),
  
  addLead: (name: string, phone: string) => apiCall({ action: 'addLead', name, phone_number: phone }),
  
  // services/api.ts
submitEstimate: (details: any) => apiCall({ 
  action: 'submitEstimate', 
  phone_number: details.phone_number,
  city: details.city,
  property_type: details.property_type,
  bhk: details.bhk,
  square_feat: details.square_feat,
  wiring_done: details.wiring_done,
  possession_status: details.possession_status,
  service_required: details.service_required
}),

  
  uploadEstimate: (id: string, document_id: string) => apiCall({ action: 'uploadEstimate', id, document_id }),
  
  reviewEstimate: (id: string, phone: string, approved: boolean) => apiCall({ action: 'reviewEstimate', id, phone_number: phone, approved }),
  
  uploadDesign: (data: Partial<Design>) => apiCall({ action: 'uploadDesign', ...data }),
  
  payCharges: (phone: string, amount: number, type: 'booking' | 'shipping' | 'post_install') => 
    apiCall({ action: 'payCharges', phone_number: phone, amount, type }),
  
  verifyPayment: (payment_id: string, estimate_id: string, type: string) => 
    apiCall({ action: 'verifyPayment', payment_id, estimate_id, type }),
  
  shareDoc: (id: string, viewer_phone: string, type: 'estimate' | 'design') => 
    apiCall({ action: 'addViewer', id, viewer_phone, type })
};
