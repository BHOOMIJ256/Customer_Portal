export interface User {
  phoneNumber: string;
  name: string;
  role: 'admin' | 'client' | 'architect';
  created_datetime?: string;
  updated_datetime?: string;
}

export interface Estimate {
  id: string;
  phone_number: string;
  city: string;
  property_type: string;
  bhk: string;
  square_feat: number;
  layout_url?: string;
  wiring_done: string;
  possession_status: string;
  service_required: string;
  date_requested: string;
  date_prepared?: string;
  date_approved?: string;
  document_id?: string;
  status: 'pending' | 'created' | 'changes requested' | 'approved';
  estimate_viewers?: string;
  created_datetime: string;
  updated_datetime: string;
}

export interface Design {
  id: string;
  estimate_id: string;
  phone_number: string;
  subject: string;
  description: string;
  document_id: string;
  status: 'pending' | 'changes requested' | 'approved';
  design_viewers?: string;
  created_datetime: string;
  updated_datetime: string;
}

export interface Opportunity {
  id: string;
  estimate_id: string;
  phone_number: string;
  booking_amount: number;
  booking_status: 'pending' | 'verified';
  paid_amount: number;
  payment_due: number;
  shipping_amount: number;
  shipping_status: 'pending' | 'verified';
  installation_status: 'pending' | 'completed';
  post_install_amount: number;
  post_install_payment_status: 'pending' | 'verified';
  created_datetime: string;
  updated_datetime: string;
}

export interface Payment {
  id: string;
  invoice_id?: string;
  phone_number: string;
  description: string;
  amount: number;
  status: 'pending' | 'verification pending' | 'paid';
  date: string;
}

export interface PortalData {
  user: User;
  recents: RecentAction[];
  allClients: User[];
  estimates?: Estimate[];
  designs?: Design[];
  opportunity?: Opportunity;
  payments?: Payment[];
}

export interface RecentAction {
  subject: string;
  description?: string;
  status: string;
  action: string;
  client?: string;
}

export type SegmentType = 'Recents' | 'Estimates' | 'Designs' | 'Payments' | 'Documents';
