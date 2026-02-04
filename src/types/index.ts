
export enum ProjectStage {
  LEAD_COLLECTED = 'Lead Collected',
  ESTIMATE_PROVIDED = 'Estimate Provided',
  DESIGN_PHASE = 'Design Phase',
  BOOKING_PAYMENT = 'Booking Payment',
  AGREEMENT_SIGNED = 'Agreement Signed',
  PROJECT_STARTED = 'Project Started',
  IN_PROGRESS = 'In Progress',
  SHIPPING_REQUEST = 'Shipping Request',
  SHIPPED = 'Shipped',
  INSTALLATION = 'Installation',
  POST_INSTALLATION = 'Post-Installation',
  COMPLETED = 'Project Completed'
}

export interface User {
  name: string;
  phoneNumber: string;
  role: 'admin' | 'client' | 'architect';
  currentStage?: ProjectStage;
  lastUpdate?: string;
}

export interface HritaUser {
  phone_number: string;
  name: string;
}

export interface AppUser {
  phone_number: string;
  name: string;
}

export interface Opportunity {
  id: string;
  phone_number: string;
  date_requested: string;
  date_prepared: string;
  date_approved: string;
  booking_amount: number;
  paid_amount: number;
  payment_due: number;
  status: ProjectStage | string;
  estimate_views: string; // comma separated phone numbers
}

export interface Invoice {
  phone_number: string;
  id: string;
  description: string;
  date: string;
  amount: number;
}

export interface Payment {
  phone_number: string;
  invoice_id: string;
  description: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Due';
  date: string;
}

export interface OtherDocument {
  phone_number: string;
  subject: string;
  description: string;
  url: string;
}

export interface ConsultationSession {
  phone_number: string;
  subject: string;
  description: string;
  date: string;
  time: string;
  status: 'Scheduled' | 'Completed' | 'Pending';
  consultant: string;
}

export interface PortalData {
  user: User;
  opportunities: Opportunity[];
  invoices: Invoice[];
  payments: Payment[];
  documents: OtherDocument[];
  consultations: ConsultationSession[];
  allClients?: User[]; // For admin view
}

export type SegmentType = 'Recents' | 'Consultation' | 'Payments' | 'Invoices' | 'My Documents' | 'Tickets';
