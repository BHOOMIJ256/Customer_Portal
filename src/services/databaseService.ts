import { EstimateRecord, DesignRecord, PaymentRecord } from '../types/workflow';
import { User, Opportunity, Invoice, OtherDocument, ConsultationSession } from '../types';

// Data shapes matching the backend response
export interface RawDB {
  Users: User[];
  HritaUsers: any[];
  Estimates: EstimateRecord[];
  Opportunities: Opportunity[];
  Designs: DesignRecord[];
  MyDocuments: OtherDocument[];
  Invoices: Invoice[];
  Payments: PaymentRecord[];
  OtherDocuments: OtherDocument[];
  ConsultationSessions: ConsultationSession[];
}

class DatabaseService {
  private db: RawDB = {
    Users: [],
    HritaUsers: [],
    Estimates: [],
    Opportunities: [],
    Designs: [],
    MyDocuments: [],
    Invoices: [],
    Payments: [],
    OtherDocuments: [],
    ConsultationSessions: []
  };

  /**
   * Update the internal cache with data from the cloud
   */
  setCloudData(data: Partial<RawDB>) {
    this.db = { ...this.db, ...data };
  }

  // Users
  getUser(phoneNumber: string) {
    return this.db.Users.find(u => u.phoneNumber === phoneNumber);
  }

  getAllUsers() {
    return this.db.Users;
  }

  // Estimates
  getEstimate(estimateId: string): EstimateRecord | undefined {
    return this.db.Estimates.find(e => e.id === estimateId);
  }

  getEstimatesByPhone(phoneNumber: string): EstimateRecord[] {
    return this.db.Estimates.filter(e => e.phone_number === phoneNumber);
  }

  getAllEstimates(): EstimateRecord[] {
    return this.db.Estimates;
  }

  addEstimate(estimate: EstimateRecord) {
    // Prevent duplicates
    if (!this.db.Estimates.find(e => e.id === estimate.id)) {
      this.db.Estimates = [estimate, ...this.db.Estimates];
    }
  }

  // Designs
  getDesign(estimateId: string): DesignRecord | undefined {
    return this.db.Designs.find(d => d.estimate_id === estimateId);
  }

  // Opportunities
  getOpportunity(estimateId: string): any {
    // Some backend logic might use estimate_id, some might use id. 
    // Aligning with standard opportunity interface.
    return this.db.Opportunities.find((o: any) => (o.estimate_id || o.id) === estimateId);
  }

  // Payments
  getPayment(estimateId: string, paymentType: string): PaymentRecord | undefined {
    return this.db.Payments.find(p => p.estimate_id === estimateId && p.payment_type === paymentType);
  }

  // Invoices
  getInvoicesByEstimate(estimateId: string): Invoice[] {
    return this.db.Invoices.filter((i: any) => i.estimate_id === estimateId);
  }

  // Documents
  getDocumentsByPhone(phoneNumber: string): OtherDocument[] {
    return this.db.OtherDocuments.filter(d => d.phone_number === phoneNumber);
  }

  // Consultations
  getConsultationsByPhone(phoneNumber: string): ConsultationSession[] {
    return this.db.ConsultationSessions.filter(c => c.phone_number === phoneNumber);
  }
}

export const db = new DatabaseService();
