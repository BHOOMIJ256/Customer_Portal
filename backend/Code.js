const SHEET_ID = '1FjH7IstiFnB3UROGI4KR_rUapKxitV9up9EN8su8_jc';

const SHEET_SCHEMAS = {
    'HritaUsers': ['phone_number', 'name', 'created_datetime', 'updated_datetime', 'created_by', 'updated_by'],
    'Users': ['phone_number', 'name', 'created_datetime', 'updated_datetime', 'created_by', 'updated_by'],
    'Estimate': ['id', 'phone_number', 'city', 'property_type', 'bhk', 'square_feat', 'layout_url', 'wiring_done', 'possession_status', 'service_required', 'date_requested', 'date_prepared', 'date_approved', 'document_id', 'status', 'estimate_viewers', 'created_datetime', 'updated_datetime', 'created_by', 'updated_by'],
    'Designs': ['id', 'estimate_id', 'phone_number', 'subject', 'description', 'document_id', 'status', 'design_viewers', 'created_datetime', 'updated_datetime', 'created_by', 'updated_by'],
    'Opportunities': ['id', 'estimate_id', 'phone_number', 'booking_amount', 'booking_status', 'paid_amount', 'payment_due', 'shipping_amount', 'shipping_status', 'installation_status', 'post_install_amount', 'post_install_payment_status', 'created_datetime', 'updated_datetime', 'created_by', 'updated_by']
};

function doGet(e) { return handleRequest(e); }
function doPost(e) { return handleRequest(e); }

function handleRequest(e) {
    try {
        let payload = e.postData ? JSON.parse(e.postData.contents) : {};
        const action = e.parameter.action || payload.action;
        const phone = e.parameter.phone_number || payload.phone_number;

        if (action === 'getData') {
            let user = findRowByValue('HritaUsers', 'phone_number', phone);
            let role = 'admin';
            if (!user) {
                user = findRowByValue('Users', 'phone_number', phone);
                role = 'client';
            }
            if (!user) return response({ status: 'error', message: 'User not found' });

            return response({
                status: 'success',
                data: {
                    user: { 
                        name: user.name, 
                        phoneNumber: user.phone_number, 
                        role: role 
                    },
                    recents: generateRecents(phone, role),
                    allClients: role === 'admin' ? getAllRows('Users') : []
                }
            });
        }
        
        if (action === 'addLead') {
            const now = new Date().toISOString();
            appendToSheet('Users', { phone_number: payload.phone_number, name: payload.name, created_datetime: now, updated_datetime: now });
            return response({ status: 'success' });
        }

        return response({ status: 'error', message: 'Unknown Action' });
    } catch (err) {
        return response({ status: 'error', message: err.toString() });
    }
}

function generateRecents(phone, role) {
    const recents = [];
    const est = findRowByValue('Estimate', 'phone_number', phone);
    if (role === 'client') {
        if (!est) {
            recents.push({ subject: "Create Estimate Request", description: "Our team will process your estimate and will let you know", status: "not requested", action: "Create Estimate" });
        } else {
            recents.push({ subject: "Create Estimate Request", description: "Our team will process your estimate and will let you know", status: est.status, action: "View Estimate" });
        }
    } else {
        if (est && est.status === 'pending') {
            recents.push({ subject: "Review lead's estimate request", description: "Lead has requested an estimate.", status: "pending", action: "Upload" });
        }
    }
    return recents;
}

function findRowByValue(sheetName, key, value) {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(sheetName);
    if (!sheet) return null;
    const data = sheet.getDataRange().getValues();
    const schema = SHEET_SCHEMAS[sheetName];
    const idx = schema.indexOf(key);
    for (let i = 1; i < data.length; i++) {
        if (data[i][idx] == value) {
            let obj = {};
            schema.forEach((f, j) => obj[f] = data[i][j]);
            return obj;
        }
    }
    return null;
}

function getAllRows(sheetName) {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(sheetName);
    if (!sheet) return [];
    const data = sheet.getDataRange().getValues();
    const schema = SHEET_SCHEMAS[sheetName];
    return data.slice(1).map(row => {
        let obj = {};
        schema.forEach((f, i) => obj[f] = row[i]);
        return obj;
    });
}

function appendToSheet(sheetName, data) {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(sheetName);
    const schema = SHEET_SCHEMAS[sheetName];
    const row = schema.map(f => data[f] || '');
    sheet.appendRow(row);
}

function response(obj) {
    return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}