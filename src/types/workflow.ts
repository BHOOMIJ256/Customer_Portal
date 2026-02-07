export enum EstimatePhase {
  ESTIMATE_REQUEST = 'estimate_request',
  ESTIMATE_REVIEW = 'estimate_review',
  DESIGN = 'design',
  BOOKING = 'booking',
  SHIPPING = 'shipping',
  INSTALLATION = 'installation',
  POST_INSTALLATION_PAYMENT = 'post_installation_payment',
  COMPLETED = 'completed'
}

export type PhaseStatus = 
  | 'not_requested' 
  | 'pending' 
  | 'created' 
  | 'approved' 
  | 'changes_requested'
  | 'verification_pending'
  | 'paid'
  | 'completed';

export interface WorkflowCard {
  id: string;
  phase: EstimatePhase;
  subject: string;
  description: string;
  status: PhaseStatus;
  action: string;
  onAction?: () => void;
  metadata?: Record<string, any>;
}

export interface EstimateRecord {
  id: string;
  phone_number: string;
  city: string;
  property_type: string;
  bhk: string;
  square_feet: string;
  layout_url: string;
  wiring_done: string;
  possession_status: string;
  service_required: string;
  date_requested: string;
  date_prepared: string;
  date_approved: string;
  date_submitted: string;
  estimate_url: string;
  estimate_viewers: string;
  status: PhaseStatus;
  current_phase: EstimatePhase;
  phase_status: PhaseStatus;
}

export interface DesignRecord {
  id: string;
  estimate_id: string;
  phone_number: string;
  subject: string;
  description: string;
  design_url: string;
  status: PhaseStatus;
  design_viewers: string;
  date_created: string;
  date_approved: string;
}

export interface PaymentRecord {
  id: string;
  invoice_id: string;
  estimate_id: string;
  phone_number: string;
  description: string;
  amount: number;
  status: PhaseStatus;
  date: string;
  payment_type: 'booking' | 'shipping' | 'post_installation';
}
