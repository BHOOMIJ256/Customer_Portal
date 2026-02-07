const SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL;

export async function updateStage(phone: string, stage: string, additionalData: any = {}) {
  try {
    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify({
        action: 'UPDATE_STAGE',
        phone: phone,
        stage: stage,
        ...additionalData
      }),
    });
    
    // Bypass WhatsApp (Simulated success)
    console.log(`[BYPASS] WhatsApp notification skipped for stage: ${stage}`);
    
    return { success: true };
  } catch (error) {
    throw error;
  }
}

export async function submitConsultation(phone: string, subject: string, description: string) {
  try {
    await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
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
    await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
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

export async function submitEstimateDetails(phone: string, details: any) {
  try {
    await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify({
        action: 'SUBMIT_ESTIMATE',
        phone: phone,
        ...details
      }),
    });
    return { success: true };
  } catch (error) {
    throw error;
  }
}

export async function adminUploadEstimate(phone: string, url: string, subject: string, description: string) {
  try {
    await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify({
        action: 'UPLOAD_ESTIMATE',
        phone: phone,
        url: url,
        subject: subject,
        description: description
      }),
    });
    return { success: true };
  } catch (error) {
    throw error;
  }
}

export async function processPayment(phone: string, amount: number, description: string) {
  // Bypass Payment Gateway
  console.log(`[BYPASS] Payment Gateway skipped for amount: ${amount}`);
  return { success: true, transactionId: `MOCK_TXN_${Date.now()}` };
}
