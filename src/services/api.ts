
const SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL;

export async function updateStage(phone: string, status: string, additionalData: any = {}) {
  try {
    const body = {
        action: 'updateStatus',
        phone_number: phone,
        status: status,
        ...additionalData // Pass additional data
    };

    await fetch(SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify(body),
    });
    return { success: true };
  } catch (error) {
    throw error;
  }
}

export async function addLead(name: string, phone: string) {
  try {
    await fetch(SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify({
        action: 'ADD_LEAD', // Use legacy action or update backend to handle it
        name: name,
        phone_number: phone
      }),
    });
    return { success: true };
  } catch (error) {
    throw error;
  }
}

export async function submitEstimateDetails(details: any) {
  try {
    await fetch(SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify({
        action: 'createEstimateRequest',
        ...details
      }),
    });
    return { success: true };
  } catch (error) {
    throw error;
  }
}

export async function adminUploadEstimate(phone: string, docData: { subject: string, url: string, description: string }) {
  try {
    await fetch(SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify({
        action: 'uploadEstimate',
        phone_number: phone,
        document_id: docData.url, 
        ...docData
      }),
    });
    return { success: true };
  } catch (error) {
    throw error;
  }
}
