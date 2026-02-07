const SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL;

async function apiCall(body: any) {
  const actionUrl = `${SCRIPT_URL}?action=${body.action}`;
  const response = await fetch(actionUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify(body),
  });
  return await response.json();
}

export const addLead = (name: string, phone: string) => apiCall({ action: 'addLead', name, phone_number: phone });
export const submitEstimateDetails = (details: any) => apiCall({ action: 'createEstimateRequest', ...details });
export const updateEstimateStatus = (phone: string, status: string) => apiCall({ action: 'updateEstimateStatus', phone_number: phone, status });
export const uploadEstimate = (phone: string, docId: string) => apiCall({ action: 'uploadEstimate', phone_number: phone, document_id: docId });