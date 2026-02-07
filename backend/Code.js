/**
 * Google Apps Script Backend for Customer Portal
 * 
 * INSTRUCTIONS:
 * 1. Create a new Google Sheet.
 * 2. Go to Extensions > Apps Script.
 * 3. Copy this code into Code.gs.
 * 4. Deploy as Web App (Deploy > New Deployment > Type: Web App > execute as: Me > Who has access: Anyone).
 * 5. Copy the URL and provide it to the frontend.
 */

// Configuration
const SHEET_ID = ''; // Leave empty to use the active spreadsheet if script is bound to sheet

function doGet(e) {
    return handleRequest(e);
}

function doPost(e) {
    return handleRequest(e);
}

function handleRequest(e) {
    const lock = LockService.getScriptLock();
    lock.tryLock(10000);

    try {
        const action = e.parameter.action;
        const method = e.parameter.method || (e.postData ? 'POST' : 'GET');

        // Parse Payload if Post
        let payload = {};
        if (e.postData && e.postData.contents) {
            try {
                payload = JSON.parse(e.postData.contents);
            } catch (err) {
                payload = e.parameter; // Fallback
            }
        }

        let result = {};

        // ROUTER
        switch (action) {
            case 'getConsultations':
                result = getConsultations(e.parameter.phone);
                break;
            case 'createConsultation':
                result = createConsultation(payload);
                break;
            case 'getProjectStatus':
                result = getProjectStatus(e.parameter.phone);
                break;
            case 'ping':
                result = { status: 'success', message: 'Pong' };
                break;
            default:
                result = { status: 'error', message: 'Invalid action' };
        }

        return createJSONOutput(result);

    } catch (error) {
        return createJSONOutput({ status: 'error', message: error.toString() });
    } finally {
        lock.releaseLock();
    }
}

// --- HELPER FUNCTIONS ---

function createJSONOutput(data) {
    return ContentService.createTextOutput(JSON.stringify(data))
        .setMimeType(ContentService.MimeType.JSON);
}

function getSheet(name) {
    const ss = SHEET_ID ? SpreadsheetApp.openById(SHEET_ID) : SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(name);
    if (!sheet) {
        sheet = ss.insertSheet(name);
        // Initialize Headers based on sheet name if needed
        // initializeHeaders(sheet, name);
    }
    return sheet;
}


// --- DATA LOGIC (To be expanded based on User Requirements) ---

function getConsultations(phone) {
    // TODO: Read from 'Consultations' sheet
    // Filter by phone
    return { status: 'success', data: [] }; // Mock response
}

function createConsultation(data) {
    // TODO: Append to 'Consultations' sheet
    return { status: 'success', message: 'Consultation created' };
}

function getProjectStatus(phone) {
    // TODO: Read from 'Users' or 'Projects' sheet
    return { status: 'success', stage: 'Lead Collected' };
}
