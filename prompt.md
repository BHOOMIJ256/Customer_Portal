# Hrita Customer Portal
Sells home automation products and services. This customer portal is being created to interact with the customers.

# Users
1. Admin: HritaUsers
2. Customer: Users / Leads / Customers / Clients / Architects

# Tech stack
- Frontend: Vite + React + TypeScript
- Backend: AppScripts
- Database: Google Sheets & Google Drive (for client documents)

# Workflows
- User: Clicks on the campaign ads
- HritaUser: Adds new lead (this lead is stored in a google sheet "Users") -> sends link via whatsapp
- User: clicks link -> log in -> gets an option in the recents tab to create an estimate request -> fills form -> submits -> status changes to "pending" in the recents tab for current user
- HritaUser: 
    - sees the pending request in the recents tab -> clicks on it -> uploads the estimate -> status changes to "pending" in the recents tab for admin's view of current user
    - in user's view, the status changes to "created"
- User: 
    - sees the created estimate in the recents tab -> clicks on review estimate -> status is "pending" in the recents tab for current user
    - if needs changes -> a form is filled by user -> status changes to "changes requested" in the recents tab for current user
    - if approved -> status changes to "approved" in the recents tab for current user
- HritaUser: 
    - sees the changes requested estimate in the recents tab -> clicks on it -> uploads the estimate -> status changes from "changes requested" to "pending" in the recents tab for admin's view of current user
    - sees the approved estimate in the recents tab -> clicks on it -> status changes to "approved" in the recents tab for admin's view of current user
- HritaUser:
    - on the new card for detailed design uploads the design -> status changes to "pending" in the recents tab for admin's view of current user
    - in user's view, new card is created with status "pending"
- User:
    - sees the pending design in the recents tab -> clicks on review design -> status is "pending" in the recents tab for current user
    - if needs changes -> a form is filled by user -> status changes to "changes requested" in the recents tab for current user
    - if approved -> status changes to "approved" in the recents tab for current user
- HritaUser:
    - sees the changes requested design in the recents tab -> clicks on it -> uploads the design -> status changes from "changes requested" to "pending" in the recents tab for admin's view of current user
    - sees the approved design in the recents tab -> clicks on it -> status changes to "approved" in the recents tab for admin's view of current user
    - After design approval, a card saying create booking request with status "pending" is created in the recents tab for admin's view of current user
    - in user's view, a card saying create booking request with status "pending" is created in the recents tab for current user
- User:
    - on new card, see booking charges with status "pending" -> clicks on pay -> status changes to "verification pending" in the recents tab for current user. Also, the same is reflect in the payments tab and invoice tab for the current user
    - and once verified -> status changes to "paid" in the recents tab for current user. Also, the same is reflect in the payments tab and invoice tab for the current user
- HritaUser:
    - sees the paid booking charges in the recents tab -> clicks on it -> status changes to "verified" in the recents tab for admin's view of current user
    - on new card, shipping request charges with status "pending" -> clicks on pay -> status changes to "verification pending" in the recents tab for current user. Also, the same is reflect in the payments tab and invoice tab for the current user
    - and once verified -> status changes to "verified" in the recents tab for current user. Also, the same is reflect in the payments tab and invoice tab for the current user
- User:
    - on new card, see shipping charges with status "pending" -> clicks on pay -> status changes to "verification pending" in the recents tab for current user. Also, the same is reflect in the payments tab and invoice tab for the current user
    - and once verified -> status changes to "paid" in the recents tab for current user. Also, the same is reflect in the payments tab and invoice tab for the current user
- HritaUser:
    - sees the paid shipping charges in the recents tab -> clicks on it -> status changes to "verified" in the recents tab for admin's view of current user
    - a new card with installation phase is created with status "pending" in the recents tab for admin's view of current user
    - in user's view, a card with installation phase is created with status "pending" in the recents tab for current user
    - On Completion of installation -> status changes to "completed" in the recents tab for admin's view of current user
    - in user's view, status changes to "completed" in the recents tab for current user
    - On Completion of installation -> a new card with post installation payment is created with status "pending" in the recents tab for admin's view of current user
    - in user's view, a card with post installation payment is created with status "pending" in the recents tab for current user
- User:
    - on new card, see post installation payment with status "pending" -> clicks on pay -> status changes to "verification pending" in the recents tab for current user. Also, the same is reflect in the payments tab and invoice tab for the current user
    - and once verified -> status changes to "paid" in the recents tab for current user. Also, the same is reflect in the payments tab and invoice tab for the current user
- HritaUser:
    - sees the paid post installation payment in the recents tab -> clicks on it -> status changes to "verified" in the recents tab for admin's view of current user

[Now the workflow is completed]

# Additional Information for workflow
- If the User wants to share estimate's pdf or design's pdf with some other users -> clicks on add estimate_viewer button -> enters phone_number -> clicks add.
- The added user will get a whatsapp message with the link to view the estimate or design.
- The added user can view the estimate or design but cannot edit or approve it.
- the user needs to login and can view the estimate or design in other documents tab.

# Envs
- VITE_GOOGLE_SCRIPT_URL=/api/google/macros/s/AKfycbycTJ3Dbj3Dzzt-YLtPoBRWvKVZflehHTV1mKlhA6UUyBBaRo8zrznLXlqBWH1D9a977g/exec
- VITE_GOOGLE_SHEET_ID=1FjH7IstiFnB3UROGI4KR_rUapKxitV9up9EN8su8_jc
- VITE_GOOGLE_DRIVE_FOLDER_ID=1AuuedagzTFu7sN_myFf3Mu8IAS2jDAFr

# Sheets and Columns
HritaUsers
- phone_number
- name
- created_datetime
- updated_datetime
- created_by
- updated_by

Users
- phone_number
- name
- created_datetime
- updated_datetime
- created_by
- updated_by

Estimate
- id
- phone_number
- city
- propery_type
- bhk
- square_feat
- layout_url
- wiring_done
- possession_status
- service_requried
- date_requested
- date_prepared
- date_approved
- document_id
- status
- estimate_viewers
- created_datetime
- updated_datetime
- created_by
- updated_by

Opportunities
- id
- estimate_id
- phone_number
- booking_amount
- paid_amount
- payment_due
- created_datetime
- updated_datetime
- created_by
- updated_by

Designs
- id
- estimate_id
- phone_number
- subject
- description
- document_id
- status
- design_viewers
- created_datetime
- updated_datetime
- created_by
- updated_by

MyDocuments
- id
- phone_number
- subject
- description
- url
- created_datetime
- updated_datetime
- created_by
- updated_by

Invoices
- id
- estimate_id
- phone_number
- description
- date
- amount
- document_id
- created_datetime
- updated_datetime
- created_by
- updated_by

Payments
- id
- invoice_id
- phone_number
- description
- amount
- status
- date
- created_datetime
- updated_datetime
- created_by
- updated_by

OtherDocuments
- id
- phone_number
- subject
- description
- url
- created_datetime
- updated_datetime
- created_by
- updated_by

ConsultationSession
- id
- phone_number
- subject
- description
- date
- time
- status
- consultant
- created_datetime
- updated_datetime
- created_by
- updated_by

# Current Status
- I was using a mock json file to display the cards. Now, I want to use the backend to display the cards.
- At this moment horizontal cards for the users are working fine but without backend. So, it now needs to be connected with the backend.
- There is no sheet named "Recents" etc. So, the cards shown in the recents tab should need to be fetched from different sheets. Eg: Cards with estimate will need to be fetched from "Estimate" sheet, cards with design will need to be fetched from "Design" sheet etc.
- Card Logic for Users:
    - Create Estimate Request
    - Approve Estimate
    - Review Design
    - Changes Requested (Uses the same card as parent but changes the status)
    - Create Booking Request
    - Pay Booking Charges
    - Pay Shipping Charges
    - Installation
    - Post Installation Payment
- Card Logic for HritaUser:
    - Uploads Estimate
    - Uploads Design
    - Make changes if requested (Uses the same card as parent but changes the status)
    - Create Booking Request
    - Create Shipping Request
    - Installation
    - Create Post Installation Payment Request
- At this moment, dont worry about payments and whatsapp integration. Just focus on the cards and their logic with the backend integration. Just bypass the payment and whatsapp integration for now.

# Additional Knowledge for you
- data to be present in the cards can be found in horizontal_cards_data.json
- apps script code can be found in backend/Code.js
- Current System you will be working is "Windows Powerpoint Shell"
- First, analyze the codebase perfectly all frontend, backend and sheets. Then, create a plan to implement the changes and share it with me.