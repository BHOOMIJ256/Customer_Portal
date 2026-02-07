import { db } from './databaseService';
import { EstimatePhase, PhaseStatus, WorkflowCard, EstimateRecord } from '../types/workflow';
import horizontalBarData from '../../horizontal_bar.json';
import * as api from './api';

type HorizontalBarData = {
  'Users-Recents': Record<string, any[]>;
  'HritaUsers-Recents': Record<string, any[]>;
};

const horizontalBar = horizontalBarData as HorizontalBarData;

export class WorkflowService {
  /**
   * Get workflow cards for a specific estimate and user role
   */
  getRecentCards(estimateId: string, userRole: 'client' | 'admin'): WorkflowCard[] {
    const estimate = db.getEstimate(estimateId);
    if (!estimate) return [];

    const cards: WorkflowCard[] = [];
    const currentPhase = estimate.current_phase;
    const phaseStatus = estimate.phase_status;

    // Define phase progression - matching backend expectations
    const phaseOrder = [
      EstimatePhase.ESTIMATE_REQUEST,
      EstimatePhase.ESTIMATE_REVIEW,
      EstimatePhase.DESIGN,
      EstimatePhase.BOOKING,
      EstimatePhase.SHIPPING,
      EstimatePhase.INSTALLATION,
      EstimatePhase.POST_INSTALLATION_PAYMENT,
      EstimatePhase.COMPLETED
    ];

    const currentPhaseIndex = phaseOrder.indexOf(currentPhase);

    // Generate cards for all phases up to and including current phase
    for (let i = 0; i <= currentPhaseIndex; i++) {
      const phase = phaseOrder[i];
      const card = this.createCardForPhase(estimateId, phase, userRole, i === currentPhaseIndex ? phaseStatus : 'completed');
      if (card) {
        cards.push(card);
      }
    }

    // Return in descending order (latest first)
    return cards.reverse();
  }

  /**
   * Create a workflow card for a specific phase
   */
  private createCardForPhase(
    estimateId: string,
    phase: EstimatePhase,
    userRole: 'client' | 'admin',
    status: PhaseStatus
  ): WorkflowCard | null {
    const estimate = db.getEstimate(estimateId);
    if (!estimate) return null;

    const design = db.getDesign(estimateId);
    const opportunity = db.getOpportunity(estimateId);

    // Map phase to horizontal_bar.json keys
    const phaseMapping: Record<EstimatePhase, { user: string; hrita: string }> = {
      [EstimatePhase.ESTIMATE_REQUEST]: {
        user: 'Estimate Request Creation',
        hrita: 'Review Estimate Request'
      },
      [EstimatePhase.ESTIMATE_REVIEW]: {
        user: 'Estimate Review',
        hrita: 'Review Estimate Request'
      },
      [EstimatePhase.DESIGN]: {
        user: 'Design Phase Review',
        hrita: 'Provide Detailed Design'
      },
      [EstimatePhase.BOOKING]: {
        user: 'Booking Phase',
        hrita: 'Request Booking Charges'
      },
      [EstimatePhase.SHIPPING]: {
        user: 'Shipping Phase',
        hrita: 'Request Shipping Charges'
      },
      [EstimatePhase.INSTALLATION]: {
        user: 'Installation Phase',
        hrita: 'Installation Phase'
      },
      [EstimatePhase.POST_INSTALLATION_PAYMENT]: {
        user: 'Payment Phase',
        hrita: 'Request Post Installation Payment'
      },
      [EstimatePhase.COMPLETED]: {
        user: 'Completed',
        hrita: 'Completed'
      }
    };

    const mapping = phaseMapping[phase];
    if (!mapping) return null;

    const dataSource = userRole === 'admin' 
      ? horizontalBar['HritaUsers-Recents'] 
      : horizontalBar['Users-Recents'];

    const phaseKey = userRole === 'admin' ? mapping.hrita : mapping.user;
    const phaseData = dataSource[phaseKey];

    if (!phaseData) return null;

    // Find the card variant matching the current status
    const cardVariant = phaseData.find((variant: any) => {
      if (status === 'completed') return variant.status === 'approved' || variant.status === 'paid' || variant.status === 'completed';
      return variant.status === status;
    }) || phaseData[0];

    return {
      id: `${estimateId}-${phase}`,
      phase,
      subject: cardVariant.subject,
      description: cardVariant.description,
      status: status,
      action: cardVariant.action,
      metadata: {
        estimateId,
        estimate,
        design,
        opportunity
      }
    };
  }

  /**
   * Transition estimate to next phase
   */
  async transitionToNextPhase(estimateId: string, phone: string, newPhase: EstimatePhase, newStatus: PhaseStatus) {
    try {
      await api.updateStage(phone, newPhase, { estimate_id: estimateId, phase_status: newStatus });
      this.sendWhatsAppNotification(phone, newPhase, newStatus);
      return { success: true };
    } catch (error) {
       console.error("Transition error:", error);
       throw error;
    }
  }

  /**
   * Update phase status without changing phase
   */
  async updatePhaseStatus(estimateId: string, phone: string, newStatus: PhaseStatus) {
    try {
      const estimate = db.getEstimate(estimateId);
      const phase = estimate?.current_phase || EstimatePhase.ESTIMATE_REQUEST;
      await api.updateStage(phone, phase, { estimate_id: estimateId, phase_status: newStatus });
      this.sendWhatsAppNotification(phone, phase, newStatus);
      return { success: true };
    } catch (error) {
      console.error("Status update error:", error);
      throw error;
    }
  }

  /**
   * Create a new estimate request
   */
  async createEstimateRequest(phoneNumber: string, estimateData: any) {
    try {
      // Optimistic Update: Create a temporary estimate record
      const tempId = `TEMP-${Date.now()}`;
      const newEstimate: EstimateRecord = {
        id: tempId,
        phone_number: phoneNumber,
        service_required: estimateData.service_required || 'Interior Design',
        bhk: estimateData.bhk || 'N/A',
        property_type: estimateData.property_type || 'Apartment',
        city: estimateData.city || 'Mumbai',
        square_feet: estimateData.square_feet || '0',
        layout_url: '',
        wiring_done: 'No',
        possession_status: 'Ready to Move',
        date_requested: new Date().toISOString(),
        date_prepared: '',
        date_approved: '',
        date_submitted: '',
        estimate_url: '',
        estimate_viewers: '',
        status: 'pending',
        current_phase: EstimatePhase.ESTIMATE_REQUEST,
        phase_status: 'pending'
      };

      // Add to local cache immediately
      db.addEstimate(newEstimate);

      const result = await api.submitEstimateDetails(phoneNumber, estimateData);
      
      this.sendWhatsAppNotification(phoneNumber, EstimatePhase.ESTIMATE_REQUEST, 'created');
      return result;
    } catch (error) {
      console.error("Creation error:", error);
      throw error;
    }
  }

  /**
   * Mock WhatsApp notification (BYPASSED)
   */
  private sendWhatsAppNotification(phoneNumber: string, phase: EstimatePhase, status: PhaseStatus) {
    // Logic bypassed as per user request
    console.log(`[BYPASS] WhatsApp notification skipped for ${phoneNumber}: ${phase}-${status}`);
  }

  /**
   * Get all estimates for a user
   * For HritaUser (1234567890), return all estimates
   * For regular users, return only their estimates
   */
  getEstimatesForUser(phoneNumber: string): EstimateRecord[] {
    // Better Admin detection: check if logged in user is admin
    const savedUser = localStorage.getItem('hrita_user');
    const rootUser = savedUser ? JSON.parse(savedUser) : null;
    const isAdmin = rootUser?.role === 'admin' || rootUser?.phoneNumber === '1234567890';
    
    // If Admin is viewing their OWN profile (not impersonating), they might want to see all
    // But usually in targetPhone logic, if we have a phoneNumber, we want that specific user's data
    // UNLESS the phoneNumber is the admin's own phone.
    
    if (isAdmin && phoneNumber === rootUser?.phoneNumber) {
      return db.getAllEstimates();
    }
    
    return db.getEstimatesByPhone(phoneNumber);
  }
}

export const workflowService = new WorkflowService();
