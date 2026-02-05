
const SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL;

export async function updateStage(phone: string, stage: string, additionalData: any = {}) {
  try {
    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'UPDATE_STAGE',
        phone: phone,
        stage: stage,
        ...additionalData
      }),
    });
    // Note: with 'no-cors', we can't read the response body.
    // In a real app, you'd use a proxy or CORS-enabled backend.
    return { success: true };
  } catch (error) {
    throw error;
  }
}

export async function submitConsultation(phone: string, subject: string, description: string) {
  try {
    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'SUBMIT_CONSULTATION',
        phone: phone,
        subject: subject,
        description: description,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
      }),
    });
    return { success: true };
  } catch (error) {
    throw error;
  }
}

export async function addLead(name: string, phone: string) {
  try {
    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'ADD_LEAD',
        name: name,
        phone: phone
      }),
    });
    return { success: true };
  } catch (error) {
    throw error;
  }
}

export async function submitEstimateDetails(details: any) {
  try {
    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'SUBMIT_ESTIMATE',
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
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'UPLOAD_ESTIMATE',
        phone: phone,
        ...docData
      }),
    });
    return { success: true };
  } catch (error) {
    throw error;
  }
}
