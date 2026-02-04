
export enum ProjectStage {
  LEAD_COLLECTED = 'Lead Collected',
  CONTACTED = 'Contacted',
  SITE_VISIT = 'Site Visit / Analysis',
  ESTIMATE_PROVIDED = 'Estimate Provided',
  DESIGN_PHASE = 'Design Phase',
  BOOKING_PAYMENT = 'Booking Payment',
  AGREEMENT_SIGNED = 'Agreement Signed',
  PROJECT_STARTED = 'Project Started',
  IN_PROGRESS = 'In Progress',
  FINAL_HANDOVER = 'Final Handover'
}

export interface User {
  name: string;
  phoneNumber: string;
  currentStage: ProjectStage;
  lastUpdate: string;
  role: 'admin' | 'client';
}

// -- Google Sheets Data Models --

export interface HritaUser {
  phone_no: string;
  fullname: string;
}

export interface AppUser {
  phone_no: string;
  fullname: string;
}

export interface ConsultationSession {
  id: string;
  phone_no: string;
  topic: string;
  date: string;
  time: string;
  duration: string; // e.g., "30 mins", "1 hour"
  status: 'Scheduled' | 'Completed' | 'Pending';
  type: 'Online' | 'In-Person';
  meeting_link?: string;
  notes?: string;
  requested_by: 'admin' | 'client';
}

export interface Invoice {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: 'Paid' | 'Due' | 'Overdue';
  docs: string; // URL to PDF
}

export interface Opportunity {
  id: string; // Estimate ID
  phone_no: string;
  stage: ProjectStage;
}

export interface Payment {
  invoices_id: string;
  docs: string; // URL to Receipt
}

export interface Ticket {
  subject: string;
  description: string;
  date: string;
  status: 'Open' | 'Resolved' | 'In Progress';
  resolution?: string;
}

export interface OtherDocument {
  name: string;
  type: string;
  url: string;
}

export interface Client {
  id: string;
  name: string;
  phoneNumber: string;
  currentStage: ProjectStage;
  lastUpdate: string;
  location: string;
  actionNeeded?: string;
}

export interface TimelineEvent {
  stage: ProjectStage;
  isCompleted: boolean;
  isCurrent: boolean;
  date?: string;
}

export type SegmentType = 'Recents' | 'Consultation' | 'Payments' | 'Invoices' | 'My Documents' | 'Tickets';
