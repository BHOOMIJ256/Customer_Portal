/**
 * Hrita Customer Portal Backend - Google Apps Script
 */

// --- CONFIGURATION ---
const SCRIPT_PROP_KEY = 'hrita_config';
// Using specific Folder ID provided: 1AuuedagzTFu7sN_myFf3Mu8IAS2jDAFr

// --- MAIN ENTRY POINTS ---

/**
 * Handle GET requests - Mainly for fetching data
 */
function doGet(e) {
  try {
    const params = e.parameter;
    const action = params.action || 'FETCH_ALL';
    const phone = params.phone;

    if (!phone && action !== 'ADD_LEAD') { // ADD_LEAD via GET link might not have phone yet? actually ADD_LEAD usually POST. 
      // For initial load we need phone to identify user
      return createResponse({ error: "Missing phone parameter" });
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let result = {};

    if (action === 'FETCH_ALL') {
      result = fetchAllDataForUser(ss, phone);
    } else if (action === 'GET_ESTIMATE_PDF') {
       // Example specific fetch if needed, but FETCH_ALL covers most
    }

    return createResponse({ success: true, data: result });

  } catch (error) {
    return createResponse({ success: false, error: error.toString() });
  }
}

/**
 * Handle POST requests - For modifying data (Create, Update, Upload)
 */
function doPost(e) {
  try {
    // Check if it's a file upload (multipart) or JSON payload
    // Note: Standard fetch with JSON body comes as e.postData.contents
    // drive uploads usually need special handling, but let's assume base64 string for simplicity 
    // or standard form-data if the frontend constructs it that way. 
    // Given the prompt "FETCH THE PDF FROM THE DRIVE", the upload part implies we need to store it.
    // For simplicity and standard React usage, we'll assume JSON body with Base64 encoded file for uploads.
    
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    
    if (!action) return createResponse({ success: false, error: "Missing action" });

    let result = {};

    switch (action) {
      case 'ADD_LEAD':
        result = addLead(ss, data);
        break;
      case 'SUBMIT_ESTIMATE':
        result = createEstimate(ss, data);
        break;
      case 'PROCESS_ESTIMATE': // HritaUser action
        result = processEstimate(ss, data); 
        break;
      case 'UPLOAD_ESTIMATE': // HritaUser uploads PDF
        result = uploadEstimateDoc(ss, data);
        break;
      case 'ADD_VIEWER':
        result = addViewer(ss, data);
        break;
      case 'UPDATE_STAGE': // General status update
        result = updateStatus(ss, data);
        break;
      case 'SUBMIT_DESIGN': // HritaUser uploads design
        result = submitDesign(ss, data);
        break;
      case 'APPROVE_DESIGN': // User action
        result = approveDesign(ss, data);
        break;
      case 'CREATE_SHIPPING': // HritaUser
        result = createShipping(ss, data);
        break;
      case 'SUBMIT_CONSULTATION':
        result = submitConsultation(ss, data);
        break;
      // Add more cases as needed
      default:
        return createResponse({ success: false, error: "Invalid action: " + action });
    }

    return createResponse(result);

  } catch (error) {
    return createResponse({ success: false, error: error.toString() });
  }
}

// --- CORE LOGIC FUNCTIONS ---

function fetchAllDataForUser(ss, phone) {
  const db = {
    user: null, // Current user profile
    isHritaUser: false,
    HritaUsers: [], // Only if admin
    Users: [], // Only if admin
    Estimates: [],
    Opportunities: [],
    Designs: [],
    MyDocuments: [],
    Invoices: [],
    Payments: [],
    OtherDocuments: [],
    ConsultationSessions: []
  };

  const hritaUsersSheet = ss.getSheetByName("HritaUsers");
  const usersSheet = ss.getSheetByName("Users");

  const allHritaUsers = getSheetData(hritaUsersSheet);
  const allUsers = getSheetData(usersSheet);

  // Normalize phone for comparison
  const cleanPhone = String(phone).trim();

  // Determine Role
  const hritaUser = allHritaUsers.find(u => String(u.phone_number).trim() === cleanPhone);
  const normalUser = allUsers.find(u => String(u.phone_number).trim() === cleanPhone);

  db.isHritaUser = !!hritaUser;
  // db.user = hritaUser || normalUser; // Return the profile found

  if (db.isHritaUser) {
    // Admin sees everything
    db.HritaUsers = allHritaUsers;
    db.Users = allUsers;
    db.Estimates = getSheetData(ss.getSheetByName("Estimate"));
    db.Opportunities = getSheetData(ss.getSheetByName("Opportunities"));
    db.Designs = getSheetData(ss.getSheetByName("Designs"));
    db.MyDocuments = getSheetData(ss.getSheetByName("MyDocuments"));
    db.Invoices = getSheetData(ss.getSheetByName("Invoices"));
    db.Payments = getSheetData(ss.getSheetByName("Payments"));
    db.OtherDocuments = getSheetData(ss.getSheetByName("OtherDocuments"));
    db.ConsultationSessions = getSheetData(ss.getSheetByName("ConsultationSession"));
  } else {
    // Normal User sees:
    // 1. Their own data (phone_number matches)
    // 2. Data shared with them (phone_number in viewers column)
    
    db.user = normalUser;

    const filterByUser = (row, viewersCol = null) => {
      const ownerMatch = String(row.phone_number).trim() === cleanPhone;
      let viewerMatch = false;
      if (viewersCol && row[viewersCol]) {
        // viewers logic: "phone1,phone2" string
        viewerMatch = String(row[viewersCol]).split(',').map(s => s.trim()).includes(cleanPhone);
      }
      return ownerMatch || viewerMatch;
    };

    db.Estimates = getSheetData(ss.getSheetByName("Estimate")).filter(r => filterByUser(r, 'estimate_viewers'));
    // Opportunities linked to visible estimates? Or usually just owners? Assuming owner for sensitive financial data unless specified.
    // Prompt says: "User can view all the estimates and their actions"
    db.Opportunities = getSheetData(ss.getSheetByName("Opportunities")).filter(r => filterByUser(r)); 
    db.Designs = getSheetData(ss.getSheetByName("Designs")).filter(r => filterByUser(r, 'design_viewers'));
    db.MyDocuments = getSheetData(ss.getSheetByName("MyDocuments")).filter(r => filterByUser(r));
    db.Invoices = getSheetData(ss.getSheetByName("Invoices")).filter(r => filterByUser(r));
    db.Payments = getSheetData(ss.getSheetByName("Payments")).filter(r => filterByUser(r));
    db.OtherDocuments = getSheetData(ss.getSheetByName("OtherDocuments")).filter(r => filterByUser(r));
    db.ConsultationSessions = getSheetData(ss.getSheetByName("ConsultationSession")).filter(r => filterByUser(r));
  }

  return db;
}

function addLead(ss, data) {
  const sheet = ss.getSheetByName("Users");
  // Check if exists
  const existing = getSheetData(sheet).find(u => String(u.phone_number) === String(data.phone));
  if (existing) {
    return { success: true, message: "User already exists", user: existing };
  }
  
  const timestamp = new Date();
  // Columns: phone_number, name, created_datetime, updated_datetime, created_by, updated_by
  sheet.appendRow([
    data.phone,
    data.name,
    timestamp,
    timestamp,
    'SYSTEM', // created_by
    'SYSTEM'
  ]);
  
  // Send WhatsApp (Simulation)
  sendWhatsapp(data.phone, "Your profile is ready. Click here to request estimate.");
  
  return { success: true, message: "Lead added successfully" };
}

function createEstimate(ss, data) {
  const sheet = ss.getSheetByName("Estimate");
  const id = Utilities.getUuid();
  const timestamp = new Date();
  
  // Columns: id, phone_number, city, propery_type, bhk, square_feat, layout_url, wiring_done, possession_status, service_requried, date_requested, date_prepared, date_approved, document_id, status, estimate_viewers, created_datetime, updated_datetime, created_by, updated_by
  sheet.appendRow([
    id,
    data.phone,
    data.city,
    data.property_type,
    data.bhk,
    data.square_feet,
    data.layout_url,
    data.wiring_done,
    data.possession_status,
    data.service_required, // Corrected column name
    timestamp, // date_requested
    '', // date_prepared
    '', // date_approved
    '', // document_id
    'REQUESTED', // status
    '', // estimate_viewers
    timestamp,
    timestamp,
    data.phone, // created_by
    data.phone
  ]);

  sendWhatsapp(data.phone, "Estimate created successfully. We will process it.");
  return { success: true, message: "Estimate requested", id: id };
}

function uploadEstimateDoc(ss, data) {
  // data: { estimate_id, phone, fileBase64, fileName, mimeType }
  const folder = getDriveFolder();
  const file = folder.createFile(Utilities.base64Decode(data.fileBase64), data.fileName || 'Estimate.pdf', data.mimeType || 'application/pdf');
  const fileUrl = file.getUrl();
  const fileId = file.getId(); // Use Drive ID for robust linking

  // Update Estimate Sheet
  const sheet = ss.getSheetByName("Estimate");
  const rows = sheet.getDataRange().getValues();
  // Assume ID is col 0 (index 0) based on header list
  const header = rows[0].map(h => h.toString().toLowerCase().replace(/ /g, "_"));
  const idIndex = header.indexOf('id');
  const statusIndex = header.indexOf('status');
  const docIdIndex = header.indexOf('document_id'); // or store URL? Prompt says document_id
  const datePreparedIndex = header.indexOf('date_prepared');
  
  let rowIndex = -1;
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][idIndex]) === String(data.estimate_id)) {
      rowIndex = i + 1; // 1-based for getRange
      break;
    }
  }

  if (rowIndex > 0) {
    sheet.getRange(rowIndex, docIdIndex + 1).setValue(fileId);
    sheet.getRange(rowIndex, statusIndex + 1).setValue('PREPARED');
    sheet.getRange(rowIndex, datePreparedIndex + 1).setValue(new Date());
    
    // Also add to MyDocuments maybe? The prompt structure has a separate MyDocuments table.
    // But usually estimate doc is linked to Estimate row.
    // Let's also add to 'OtherDocuments' or 'MyDocuments' if needed for easy access list.
    // Prompt: "Once estimate verified, HritaUser upload Estimate.pdf... logged into Google sheets... date_prepared... whatsapp msg"
    
     sendWhatsapp(data.phone, "Your Estimate is ready. Login to view.");
     return { success: true, message: "Estimate uploaded", fileUrl: fileUrl };
  }
  
  return { success: false, error: "Estimate ID not found" };
}

function submitDesign(ss, data) {
  // similar to uploadEstimateDoc but for Designs sheet
  const folder = getDriveFolder();
  const file = folder.createFile(Utilities.base64Decode(data.fileBase64), data.fileName || 'Design.pdf', data.mimeType || 'application/pdf');
  
  const sheet = ss.getSheetByName("Designs");
  const id = Utilities.getUuid();
  const timestamp = new Date();

  // Columns: id, estimate_id, phone_number, subject, description, document_id, status, design_viewers, created_datetime, updated_datetime, created_by, updated_by
  sheet.appendRow([
    id,
    data.estimate_id,
    data.phone,
    'Detailed Design',
    data.description || '',
    file.getId(),
    'SUBMITTED',
    '',
    timestamp,
    timestamp,
    'HRITA_ADMIN', // Usually HritaUser uploads this
    'HRITA_ADMIN'
  ]);
  
  sendWhatsapp(data.phone, "Detailed Design shared. Please review.");
  return { success: true };
}

function submitConsultation(ss, data) {
  const sheet = ss.getSheetByName("ConsultationSession");
  const id = Utilities.getUuid();
  const timestamp = new Date();
  
  // id, phone_number, subject, description, date, time, status, consultant, created_datetime, updated_datetime, created_by, updated_by
  sheet.appendRow([
    id,
    data.phone,
    data.subject,
    data.description,
    data.date, // requested date
    data.time, // requested time
    'REQUESTED',
    '', // consultant
    timestamp,
    timestamp,
    data.phone,
    data.phone
  ]);
  
  return { success: true, message: "Consultation requested" };
}

function addViewer(ss, data) {
  // Add a phone number to estimate_viewers or design_viewers
  const { sheetName, recordId, viewerPhone } = data; // sheetName: 'Estimate' or 'Designs'
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) return { success: false, error: "Invalid sheet" };
  
  const rows = sheet.getDataRange().getValues();
  const header = rows[0].map(h => h.toString().toLowerCase().replace(/ /g, "_"));
  const idIndex = header.indexOf('id');
  const viewerColName = sheetName === 'Estimate' ? 'estimate_viewers' : 'design_viewers';
  const viewerIndex = header.indexOf(viewerColName);
  
  if (idIndex === -1 || viewerIndex === -1) return { success: false, error: "Columns not found" };

  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][idIndex]) === String(recordId)) {
      const currentViewers = String(rows[i][viewerIndex] || '');
      const newViewers = currentViewers ? currentViewers + ',' + viewerPhone : viewerPhone;
      
      // Update
      sheet.getRange(i + 1, viewerIndex + 1).setValue(newViewers);
      return { success: true, message: "Viewer added" };
    }
  }
  return { success: false, error: "Record not found" };
}



function processEstimate(ss, data) {
  // HritaUser moves estimate to processing state
  const sheet = ss.getSheetByName("Estimate");
  const result = updateRow(sheet, data.estimate_id, {
    status: 'PROCESSING',
    updated_datetime: new Date(),
    updated_by: data.admin_phone || 'HRITA_ADMIN'
  });
  
  if (result.success) {
    sendWhatsapp(data.phone, "Your estimate request is being processed.");
  }
  return result;
}

function updateStatus(ss, data) {
  // Generic update status for Estimate or other entities
  // Expects: data.id or data.estimate_id, and data.stage (status)
  // Default to Estimate sheet if not specified
  const sheetName = data.sheetName || "Estimate";
  const sheet = ss.getSheetByName(sheetName);
  const id = data.id || data.estimate_id;
  
  if (!id) return { success: false, error: "Missing ID for update" };
  
  const result = updateRow(sheet, id, {
    status: data.stage,
    updated_datetime: new Date(),
    updated_by: data.phone || 'SYSTEM'
  });
  
  return result;
}

function approveDesign(ss, data) {
  // User approves design
  const sheet = ss.getSheetByName("Designs");
  const result = updateRow(sheet, data.design_id, {
    status: 'APPROVED',
    updated_datetime: new Date(),
    updated_by: data.phone
  });
  
  if (result.success) {
    // Maybe trigger next step: Create Shipping Request automatically? 
    // Or just notify admin.
    // "if approved, creates a shipping request" -> implied Admin creates it manually after notification? 
    // "notified via whatsapp"
    sendWhatsapp(data.phone, "Design approved. We will prepare shipping.");
    // Notify Admin too theoretically
  }
  return result;
}

function createShipping(ss, data) {
  // HritaUser creates shipping request (Invoice)
  // "approves shipping request and pays shipping charges"
  // So we create an Invoice with description 'Shipping Charges'
  const sheet = ss.getSheetByName("Invoices");
  const id = Utilities.getUuid();
  const timestamp = new Date();
  
  // id, estimate_id, phone_number, description, date, amount, document_id, created_datetime, updated_datetime, created_by, updated_by
  sheet.appendRow([
    id,
    data.estimate_id,
    data.phone,
    'Shipping Charges',
    new Date(), // date
    data.amount,
    '', // document_id
    timestamp,
    timestamp,
    'HRITA_ADMIN',
    'HRITA_ADMIN'
  ]);
  
  sendWhatsapp(data.phone, "Shipping request generated. Please pay the shipping charges.");
  return { success: true, message: "Shipping request created", invoice_id: id };
}

// Helper to update a row by ID
function updateRow(sheet, id, updates) {
  const rows = sheet.getDataRange().getValues();
  if (rows.length <= 1) return { success: false, error: "No data" };
  
  const header = rows[0].map(h => h.toString().toLowerCase().replace(/ /g, "_"));
  const idIndex = header.indexOf('id');
  if (idIndex === -1) return { success: false, error: "ID column not found" };
  
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][idIndex]) === String(id)) {
      const rowIndex = i + 1;
      
      Object.keys(updates).forEach(key => {
        const colIndex = header.indexOf(key);
        if (colIndex !== -1) {
          sheet.getRange(rowIndex, colIndex + 1).setValue(updates[key]);
        }
      });
      
      return { success: true, message: "Updated successfully" };
    }
  }
  return { success: false, error: "Record not found" };
}

// --- HELPER FUNCTIONS ---

function getSheetData(sheet) {
  if (!sheet) return [];
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];
  const headers = data.shift().map(h => h.toString().toLowerCase().replace(/ /g, "_"));
  return data.map(row => {
    const obj = {};
    headers.forEach((h, i) => obj[h] = row[i]);
    return obj;
  });
}

function createResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function getDriveFolder() {
  const folderId = '1AuuedagzTFu7sN_myFf3Mu8IAS2jDAFr'; // Provided client_documents folder ID
  try {
    return DriveApp.getFolderById(folderId);
  } catch (e) {
    // Fallback or log if ID is inaccessible
    const folders = DriveApp.getFoldersByName('client_documents');
    if (folders.hasNext()) return folders.next();
    return DriveApp.createFolder('client_documents');
  }
}

function sendWhatsapp(phone, message) {
  // Mock function - in reality calls Twilio or similar API
  Logger.log(`Sending WhatsApp to ${phone}: ${message}`);
}
