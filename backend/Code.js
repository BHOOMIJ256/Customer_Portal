/**
 * Google Apps Script Backend for Customer Portal
 */

// Configuration
const SHEET_ID = '1FjH7IstiFnB3UROGI4KR_rUapKxitV9up9EN8su8_jc';

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

        // Parse Payload if Post
        let payload = {};
        if (e.postData && e.postData.contents) {
            try {
                payload = JSON.parse(e.postData.contents);
            } catch (err) {
                payload = e.parameter; // Fallback
            }
        } else {
            payload = e.parameter;
        }

        let result = {};

        // ROUTER
        if (action === 'getData') {
            result = getData(payload.phone, payload.viewAsRole);
        } else if (action === 'createEstimateRequest') {
            result = createEstimateRequest(payload);
        } else if (action === 'updateStatus') {
            result = updateStatus(payload);
        } else if (action === 'uploadEstimate') {
            result = uploadEstimate(payload);
        } else if (action === 'uploadDesign') {
            result = uploadDesign(payload);
        } else if (action === 'createBookingRequest') {
            result = createBookingRequest(payload);
        } else if (action === 'createShippingRequest') {
            result = createShippingRequest(payload);
        } else if (action === 'updateInstallationStatus') {
            result = updateInstallationStatus(payload);
        } else if (action === 'createPostInstallationPayment') {
            result = createPostInstallationPayment(payload);
        } else if (action === 'addLead') {
            result = addLead(payload);
        } else if (action === 'verifyPayment') {
            result = verifyPayment(payload);
        } else if (action === 'makePayment') {
            result = makePayment(payload);
        } else if (action === 'ping') {
             result = { status: 'success', message: 'Pong' };
        } else {
             // Fallback for usePortalData which might not send action
             if (payload.phone) {
                 result = getData(payload.phone);
             } else {
                 result = { status: 'error', message: 'Action not found' };
             }
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
    }
    return sheet;
}

function readSheet(name) {
    const sheet = getSheet(name);
    if (sheet.getLastRow() <= 1) return []; // Only headers or empty
    
    const range = sheet.getDataRange();
    const values = range.getValues();
    
    const headers = values[0];
    const data = [];
    
    for (let i = 1; i < values.length; i++) {
        let row = values[i];
        let obj = {};
        for (let j = 0; j < headers.length; j++) {
            obj[headers[j]] = row[j];
        }
        data.push(obj);
    }
    return data;
}

function appendToSheet(name, dataObj) {
    const sheet = getSheet(name);
    let headers = [];
    if (sheet.getLastRow() === 0) {
        headers = Object.keys(dataObj);
        sheet.appendRow(headers);
    } else {
        headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    }
    
    const row = headers.map(h => dataObj[h] || '');
    sheet.appendRow(row);
}

function updateSheetRow(name, keyField, keyValue, updates) {
    const sheet = getSheet(name);
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const keyIndex = headers.indexOf(keyField);
    
    if (keyIndex === -1) return false;
    
    for (let i = 1; i < data.length; i++) {
        if (String(data[i][keyIndex]) === String(keyValue)) {
            // Found row
            const keys = Object.keys(updates);
            keys.forEach(k => {
                const colIndex = headers.indexOf(k);
                if (colIndex > -1) {
                    sheet.getRange(i + 1, colIndex + 1).setValue(updates[k]);
                }
            });
            return true;
        }
    }
    return false;
}

// --- DATA LOGIC ---

function getData(phone, viewAsRole) {
    if (!phone) return { status: 'error', message: 'Phone number required' };
    phone = String(phone).trim();

    const hritaUsers = readSheet('HritaUsers');
    const users = readSheet('Users');
    
    // Check if admin
    const adminUser = hritaUsers.find(u => String(u.phone_number) === phone);
    const clientUser = users.find(u => String(u.phone_number) === phone);
    
    let role = 'client';
    let name = 'Guest';
    if (adminUser) {
        role = 'admin';
        name = adminUser.name;
    } else if (clientUser) {
        name = clientUser.name;
    }
    
    // Determine the role to use for card generation
    // If viewAsRole is specified (e.g. 'admin' looking at client), use that.
    // Otherwise use the intrinsic role of the phone number.
    const effectiveRole = viewAsRole || role;

    const response = {
        user: { name, phoneNumber: phone, role }, // Return intrinsic role
        status: 'success'
    };
    
    if (effectiveRole === 'admin') {
        response.allClients = users.map(u => ({
            name: u.name,
            phone_number: String(u.phone_number), // Normalized
            role: 'client'
        }));
    }

    // Filter data by phone
    const filterByPhone = (data) => data.filter(r => String(r.phone_number) === phone);

    const estimates = filterByPhone(readSheet('Estimate'));
    const designs = filterByPhone(readSheet('Designs'));
    const opportunities = filterByPhone(readSheet('Opportunities')); // Booking/Shipping/Install flow
    response.invoices = filterByPhone(readSheet('Invoices'));
    response.payments = filterByPhone(readSheet('Payments'));
    response.consultations = filterByPhone(readSheet('ConsultationSession')); 
    response.myDocuments = filterByPhone(readSheet('MyDocuments'));
    response.documents = filterByPhone(readSheet('OtherDocuments'));
    
    // --- GENERATE RECENTS CARDS ---
    response.recents = generateRecents(effectiveRole, phone, { estimates, designs, opportunities });
    
    // Also attach opportunities (for modal usage)
    response.opportunities = opportunities;

    return response;
}

function generateRecents(role, phone, data) {
    const cards = [];
    const { estimates, designs, opportunities } = data;
    
    // Helper to add card
    const addCard = (card) => cards.push(card);

    // 1. Estimate
    const est = estimates.length > 0 ? estimates[estimates.length - 1] : null; // Get latest?
    
    if (!est) {
        // No estimate
        if (role === 'client') {
            addCard({
                id: 'est-new',
                subject: "Create Estimate Request",
                description: "Our team will process your estimate and will let you know",
                status: "not requested",
                action: "Create Estimate",
                type: 'estimate_request'
            });
        }
    } else {
        // Estimate Exists
        const status = est.status;
        
        if (role === 'client') {
             if (status === 'pending') {
                addCard({
                    id: 'est-pending',
                    subject: "Create Estimate Request",
                    description: "Our team will process your estimate and will let you know",
                    status: "pending",
                    action: "View Estimate",
                    type: 'estimate_view'
                });
             } else if (status === 'created' || status === 'estimate_prepared') {
                 addCard({
                    id: 'est-review',
                    subject: "Estimate Ready for Review",
                    description: "Our team has prepared your estimate. Please review it.",
                    status: "pending", // User sees pending when action is required
                    action: "Review Estimate",
                    type: 'estimate_review'
                 });
             } else if (status === 'changes requested') {
                 addCard({
                    id: 'est-changes',
                    subject: "Estimate Ready for Review",
                    description: "You requested changes. Updating...",
                    status: "changes requested",
                    action: "Review Estimate"
                 });
             } else if (status === 'approved') {
                 addCard({
                    id: 'est-approved',
                    subject: "Estimate Ready for Review",
                    description: "Estimate Approved.",
                    status: "approved",
                    action: "View Estimate",
                    type: 'estimate_view'
                 });
             }
        } else if (role === 'admin') {
             if (status === 'pending') {
                 addCard({
                     id: 'adm-est-upload',
                     subject: "Review lead's estimate request",
                     description: "Lead sent estimate request.",
                     status: "pending",
                     action: "Upload",
                     type: "admin_estimate_upload"
                 });
             } else if(status === 'changes requested') {
                  addCard({
                     id: 'adm-est-upload-changes',
                     subject: "Review lead's estimate request",
                     description: "Lead requested changes.",
                     status: "changes requested",
                     action: "Upload",
                     type: "admin_estimate_upload"
                 });
             } else if(status === 'approved') {
                 addCard({
                     id: 'adm-est-approved',
                     subject: "Review lead's estimate request",
                     description: "Estimate Approved.",
                     status: "approved", // or 'verified'
                     action: "View",
                     type: "admin_estimate_view"
                 });
             }
        }
    }

    // 2. Design (Visible if Estimate Approved)
    if (est && est.status === 'approved') {
        const des = designs.length > 0 ? designs[0] : null;
        if (!des) {
            if (role === 'admin') {
                addCard({
                    id: 'adm-design-new',
                    subject: "Provide Detailed Design",
                    description: "Lead approved estimate.",
                    status: "pending",
                    action: "Upload",
                    type: "admin_design_upload"
                });
            } else {
                 // User sees new card with status "pending"?
                 // Prompt: "in user's view, new card is created with status pending"
                 // But wait, if admin hasn't uploaded, how is card created?
                 // "HritaUser: ... uploads the design ... in user's view, new card is created"
                 // So card exists ONLY after admin uploads? 
                 // Actually prompt says: "HritaUser: on the new card for detailed design uploads... status changes to pending"
                 // This implies Admin sees the card BEFORE uploading. (Handled above).
                 // User sees it AFTER upload?
                 // "in user's view, new card is created with status 'pending'" -> This implies after Upload.
            }
        } else {
            // Design row exists
             const dStatus = des.status;
             if (role === 'client') {
                 // User Logic
                 if (dStatus === 'created' || dStatus === 'uploaded') {
                     addCard({
                         id: 'des-review',
                         subject: "Design Phase Review",
                         description: "Design Ready.",
                         status: "pending",
                         action: "Review Design",
                         type: "design_review"
                     });
                 } else if (dStatus === 'changes requested') {
                      addCard({
                         id: 'des-changes',
                         subject: "Design Phase Review",
                         description: "Changes requested.",
                         status: "changes requested",
                         action: "Review Design"
                     });
                 } else if (dStatus === 'approved') {
                      addCard({
                         id: 'des-approved',
                         subject: "Design Phase Review",
                         description: "Design Approved.",
                         status: "approved",
                         action: "View Design",
                         type: "design_view"
                     });
                 }
             } else if (role === 'admin') {
                 // Admin Logic
                 if (dStatus === 'changes requested') {
                     addCard({
                         id: 'adm-des-changes',
                         subject: "Provide Detailed Design",
                         description: "Lead requested changes.",
                         status: "changes requested",
                         action: "Upload",
                         type: "admin_design_upload"
                     });
                 } else if (dStatus === 'approved') {
                      addCard({
                         id: 'adm-des-approved',
                         subject: "Provide Detailed Design",
                         description: "Design Approved.",
                         status: "approved",
                         action: "View",
                         type: "admin_design_view"
                     });
                 }
             }
        }
    }
    
    // 3. Booking / Opportunities
    // If Design Approved -> Booking
    if (designs.length > 0 && designs[0].status === 'approved') {
         const opp = opportunities.length > 0 ? opportunities[0] : null;
         
         if (!opp) {
             // No opportunity created yet
             if (role === 'admin') {
                  addCard({
                      id: 'adm-booking-req',
                      subject: "Create Booking Request",
                      description: "Design approved. Create booking request.",
                      status: "pending",
                      action: "Create Request",
                      type: "admin_create_booking"
                  });
             }
             // Client sees nothing until admin creates booking request
         } else {
             // Opportunity exists - check booking status
             const bookingStatus = opp.booking_status || opp.status;
             
             // BOOKING PHASE
             if (bookingStatus === 'booking_pending' || bookingStatus === 'pending') {
                 if (role === 'client') {
                      addCard({
                          id: 'book-pay',
                          subject: "Booking Charges",
                          description: `Pay booking advance of ₹${opp.booking_amount || 0}`,
                          status: "pending",
                          action: "Pay",
                          type: "booking_pay"
                      });
                 } else if (role === 'admin') {
                      addCard({
                          id: 'adm-book-pending',
                          subject: "Booking Request Created",
                          description: "Waiting for client payment.",
                          status: "pending",
                          action: "View",
                          type: "admin_booking_view"
                      });
                 }
             } else if (bookingStatus === 'booking_verification_pending') {
                 if (role === 'client') {
                      addCard({
                          id: 'book-verify',
                          subject: "Booking Charges",
                          description: "Payment verification pending.",
                          status: "verification pending",
                          action: "View",
                          type: "booking_verify"
                      });
                 } else if (role === 'admin') {
                      addCard({
                          id: 'adm-book-verify',
                          subject: "Verify Booking Payment",
                          description: "Client made payment. Verify it.",
                          status: "paid",
                          action: "Verify",
                          type: "admin_verify_booking"
                      });
                 }
             } else if (bookingStatus === 'booking_verified' || bookingStatus === 'booking_paid') {
                 // Booking completed - move to shipping
                 const shippingStatus = opp.shipping_status;
                 
                 if (!shippingStatus || shippingStatus === 'not_started') {
                     // SHIPPING PHASE - Not started
                     if (role === 'admin') {
                          addCard({
                              id: 'adm-shipping-req',
                              subject: "Create Shipping Request",
                              description: "Booking verified. Create shipping request.",
                              status: "pending",
                              action: "Create Request",
                              type: "admin_create_shipping"
                          });
                     }
                     // Client sees nothing until shipping request created
                 } else if (shippingStatus === 'shipping_pending' || shippingStatus === 'pending') {
                     if (role === 'client') {
                          addCard({
                              id: 'ship-pay',
                              subject: "Shipping Charges",
                              description: "Pay shipping charges.",
                              status: "pending",
                              action: "Pay",
                              type: "shipping_pay"
                          });
                     } else if (role === 'admin') {
                          addCard({
                              id: 'adm-ship-pending',
                              subject: "Shipping Request Created",
                              description: "Waiting for client payment.",
                              status: "pending",
                              action: "View",
                              type: "admin_shipping_view"
                          });
                     }
                 } else if (shippingStatus === 'shipping_verification_pending') {
                     if (role === 'client') {
                          addCard({
                              id: 'ship-verify',
                              subject: "Shipping Charges",
                              description: "Payment verification pending.",
                              status: "verification pending",
                              action: "View",
                              type: "shipping_verify"
                          });
                     } else if (role === 'admin') {
                          addCard({
                              id: 'adm-ship-verify',
                              subject: "Verify Shipping Payment",
                              description: "Client made payment. Verify it.",
                              status: "paid",
                              action: "Verify",
                              type: "admin_verify_shipping"
                          });
                     }
                 } else if (shippingStatus === 'shipping_verified' || shippingStatus === 'shipping_paid') {
                     // Shipping completed - move to installation
                     const installStatus = opp.installation_status;
                     
                     if (!installStatus || installStatus === 'not_started' || installStatus === 'pending') {
                         // INSTALLATION PHASE - Pending/In Progress
                         if (role === 'admin') {
                              addCard({
                                  id: 'adm-install-progress',
                                  subject: "Installation Phase",
                                  description: "Shipping verified. Update installation status.",
                                  status: installStatus === 'in_progress' ? 'in progress' : 'pending',
                                  action: "Update Status",
                                  type: "admin_update_installation"
                              });
                         } else if (role === 'client') {
                              addCard({
                                  id: 'install-progress',
                                  subject: "Installation Phase",
                                  description: "Installation in progress.",
                                  status: installStatus === 'in_progress' ? 'in progress' : 'pending',
                                  action: "View Status",
                                  type: "installation_view"
                              });
                         }
                     } else if (installStatus === 'in_progress') {
                         // Installation ongoing
                         if (role === 'admin') {
                              addCard({
                                  id: 'adm-install-ongoing',
                                  subject: "Installation Phase",
                                  description: "Installation in progress.",
                                  status: "in progress",
                                  action: "Mark Complete",
                                  type: "admin_complete_installation"
                              });
                         } else if (role === 'client') {
                              addCard({
                                  id: 'install-ongoing',
                                  subject: "Installation Phase",
                                  description: "Installation in progress.",
                                  status: "in progress",
                                  action: "View Status",
                                  type: "installation_view"
                              });
                         }
                     } else if (installStatus === 'completed') {
                         // Installation completed - move to post-installation payment
                         const postInstallStatus = opp.post_install_payment_status;
                         
                         if (!postInstallStatus || postInstallStatus === 'not_started') {
                             // POST-INSTALLATION PAYMENT - Not started
                             if (role === 'admin') {
                                  addCard({
                                      id: 'adm-postinstall-req',
                                      subject: "Create Post-Installation Payment",
                                      description: "Installation completed. Create final payment request.",
                                      status: "pending",
                                      action: "Create Request",
                                      type: "admin_create_postinstall"
                                  });
                             }
                             // Client sees nothing until payment request created
                         } else if (postInstallStatus === 'pending') {
                             if (role === 'client') {
                                  addCard({
                                      id: 'postinstall-pay',
                                      subject: "Post-Installation Payment",
                                      description: "Final project payment.",
                                      status: "pending",
                                      action: "Pay",
                                      type: "postinstall_pay"
                                  });
                             } else if (role === 'admin') {
                                  addCard({
                                      id: 'adm-postinstall-pending',
                                      subject: "Post-Installation Payment Created",
                                      description: "Waiting for client payment.",
                                      status: "pending",
                                      action: "View",
                                      type: "admin_postinstall_view"
                                  });
                             }
                         } else if (postInstallStatus === 'verification_pending') {
                             if (role === 'client') {
                                  addCard({
                                      id: 'postinstall-verify',
                                      subject: "Post-Installation Payment",
                                      description: "Payment verification pending.",
                                      status: "verification pending",
                                      action: "View",
                                      type: "postinstall_verify"
                                  });
                             } else if (role === 'admin') {
                                  addCard({
                                      id: 'adm-postinstall-verify',
                                      subject: "Verify Post-Installation Payment",
                                      description: "Client made final payment. Verify it.",
                                      status: "paid",
                                      action: "Verify",
                                      type: "admin_verify_postinstall"
                                  });
                             }
                         } else if (postInstallStatus === 'verified' || postInstallStatus === 'paid') {
                             // PROJECT COMPLETED!
                             if (role === 'client') {
                                  addCard({
                                      id: 'project-complete',
                                      subject: "Project Completed",
                                      description: "Thank you for choosing Hrita!",
                                      status: "completed",
                                      action: "View Summary",
                                      type: "project_completed"
                                  });
                             } else if (role === 'admin') {
                                  addCard({
                                      id: 'adm-project-complete',
                                      subject: "Project Completed",
                                      description: "All payments verified. Project completed.",
                                      status: "completed",
                                      action: "View Summary",
                                      type: "admin_project_completed"
                                  });
                             }
                         }
                     }
                 }
             }
         }
    }
    
    return cards;
}

function createEstimateRequest(data) {
    const row = {
        phone_number: data.phone_number,
        city: data.city || '',
        property_type: data.property_type || '',
        id: 'EST-' + new Date().getTime(),
        status: 'pending',
        created_datetime: new Date().toISOString()
    };
    appendToSheet('Estimate', row);
    return { status: 'success', message: 'Estimate Requested' };
}

function updateStatus(data) {
    // Specialized per type?
    // Expects: type (estimate, design, etc), phone, status
    const phone = data.phone_number;
    const type = data.type;
    const status = data.status;
    
    if (type === 'estimate') {
        updateSheetRow('Estimate', 'phone_number', phone, { status: status, updated_datetime: new Date().toISOString() });
    } else if (type === 'design') {
        updateSheetRow('Designs', 'phone_number', phone, { status: status, updated_datetime: new Date().toISOString() });
    } else if (type === 'opportunity') {
        updateSheetRow('Opportunities', 'phone_number', phone, { status: status, updated_datetime: new Date().toISOString() });
    }
    
    return { status: 'success' };
}

function uploadEstimate(data) {
    // Admin uploads estimate
    // Updates Estimate sheet: status='created', document_id=...
    const phone = data.phone_number;
    updateSheetRow('Estimate', 'phone_number', phone, { 
        status: 'created', 
        document_id: data.document_id,
        date_prepared: new Date().toISOString().split('T')[0],
        updated_datetime: new Date().toISOString()
    });
    return { status: 'success', message: 'Estimate uploaded' };
}

function uploadDesign(data) {
    // Admin uploads design
    const phone = data.phone_number;
    const estimateId = data.estimate_id;
    
    // Check if design row exists
    const designs = readSheet('Designs');
    const existing = designs.find(d => String(d.phone_number) === phone);
    
    if (existing) {
        // Update existing design
        updateSheetRow('Designs', 'phone_number', phone, {
            status: 'created',
            document_id: data.document_id,
            subject: data.subject || 'Design Document',
            description: data.description || '',
            updated_datetime: new Date().toISOString()
        });
    } else {
        // Create new design row
        appendToSheet('Designs', {
            id: 'DES-' + new Date().getTime(),
            estimate_id: estimateId,
            phone_number: phone,
            subject: data.subject || 'Design Document',
            description: data.description || '',
            document_id: data.document_id,
            status: 'created',
            created_datetime: new Date().toISOString()
        });
    }
    
    return { status: 'success', message: 'Design uploaded' };
}

function createBookingRequest(data) {
    // Admin creates booking request
    const phone = data.phone_number;
    const bookingAmount = data.booking_amount || 0;
    
    // Check if opportunity exists
    const opportunities = readSheet('Opportunities');
    const existing = opportunities.find(o => String(o.phone_number) === phone);
    
    if (existing) {
        // Update existing opportunity
        updateSheetRow('Opportunities', 'phone_number', phone, {
            booking_status: 'booking_pending',
            booking_amount: bookingAmount,
            updated_datetime: new Date().toISOString()
        });
    } else {
        // Create new opportunity
        const estimates = readSheet('Estimate');
        const estimate = estimates.find(e => String(e.phone_number) === phone);
        
        appendToSheet('Opportunities', {
            id: 'OPP-' + new Date().getTime(),
            estimate_id: estimate ? estimate.id : '',
            phone_number: phone,
            booking_amount: bookingAmount,
            booking_status: 'booking_pending',
            paid_amount: 0,
            payment_due: bookingAmount,
            created_datetime: new Date().toISOString()
        });
    }
    
    return { status: 'success', message: 'Booking request created' };
}

function createShippingRequest(data) {
    // Admin creates shipping request
    const phone = data.phone_number;
    const shippingAmount = data.shipping_amount || 0;
    
    updateSheetRow('Opportunities', 'phone_number', phone, {
        shipping_status: 'shipping_pending',
        shipping_amount: shippingAmount,
        updated_datetime: new Date().toISOString()
    });
    
    return { status: 'success', message: 'Shipping request created' };
}

function updateInstallationStatus(data) {
    // Admin updates installation status
    const phone = data.phone_number;
    const installStatus = data.installation_status; // 'pending', 'in_progress', 'completed'
    
    updateSheetRow('Opportunities', 'phone_number', phone, {
        installation_status: installStatus,
        updated_datetime: new Date().toISOString()
    });
    
    return { status: 'success', message: 'Installation status updated' };
}

function createPostInstallationPayment(data) {
    // Admin creates post-installation payment request
    const phone = data.phone_number;
    const amount = data.amount || 0;
    
    updateSheetRow('Opportunities', 'phone_number', phone, {
        post_install_payment_status: 'pending',
        post_install_amount: amount,
        updated_datetime: new Date().toISOString()
    });
    
    return { status: 'success', message: 'Post-installation payment created' };
}

function addLead(data) {
    // Admin adds new lead
    const phone = data.phone_number;
    const name = data.name;
    
    // Check if user already exists
    const users = readSheet('Users');
    const existing = users.find(u => String(u.phone_number) === phone);
    
    if (existing) {
        return { status: 'error', message: 'User already exists' };
    }
    
    appendToSheet('Users', {
        phone_number: phone,
        name: name,
        created_datetime: new Date().toISOString(),
        created_by: 'admin'
    });
    
    return { status: 'success', message: 'Lead added successfully' };
}

function verifyPayment(data) {
    // Admin verifies payment
    const phone = data.phone_number;
    const paymentType = data.payment_type; // 'booking', 'shipping', 'postinstall'
    
    if (paymentType === 'booking') {
        updateSheetRow('Opportunities', 'phone_number', phone, {
            booking_status: 'booking_verified',
            updated_datetime: new Date().toISOString()
        });
    } else if (paymentType === 'shipping') {
        updateSheetRow('Opportunities', 'phone_number', phone, {
            shipping_status: 'shipping_verified',
            updated_datetime: new Date().toISOString()
        });
    } else if (paymentType === 'postinstall') {
        updateSheetRow('Opportunities', 'phone_number', phone, {
            post_install_payment_status: 'verified',
            updated_datetime: new Date().toISOString()
        });
    }
    
    return { status: 'success', message: 'Payment verified' };
}

function makePayment(data) {
    // Client makes payment
    const phone = data.phone_number;
    const paymentType = data.payment_type; // 'booking', 'shipping', 'postinstall'
    
    if (paymentType === 'booking') {
        updateSheetRow('Opportunities', 'phone_number', phone, {
            booking_status: 'booking_verification_pending',
            updated_datetime: new Date().toISOString()
        });
    } else if (paymentType === 'shipping') {
        updateSheetRow('Opportunities', 'phone_number', phone, {
            shipping_status: 'shipping_verification_pending',
            updated_datetime: new Date().toISOString()
        });
    } else if (paymentType === 'postinstall') {
        updateSheetRow('Opportunities', 'phone_number', phone, {
            post_install_payment_status: 'verification_pending',
            updated_datetime: new Date().toISOString()
        });
    }
    
    return { status: 'success', message: 'Payment submitted for verification' };
}
