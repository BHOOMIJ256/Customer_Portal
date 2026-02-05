
import React from 'react';
import { ProjectStage } from '../types';

interface TimelineProps {
  currentStage: ProjectStage;
  onAction?: (stage: ProjectStage) => void;
  isViewerAdmin?: boolean;
}

interface StageAction {
  label: string;
  style: 'primary' | 'secondary' | 'ghost';
  statusLabel?: string;
}

const getStageConfig = (stage: ProjectStage, currentStage: ProjectStage, isViewerAdmin: boolean): StageAction => {
  const allStages = Object.values(ProjectStage);
  const currentIndex = allStages.indexOf(currentStage);
  const stageIndex = allStages.indexOf(stage);

  if (stageIndex < currentIndex) {
    return { label: 'Completed', style: 'ghost', statusLabel: 'Verified & Closed' };
  }

  if (stageIndex === currentIndex) {
    if (isViewerAdmin) {
      switch (stage) {
        case ProjectStage.LEAD_COLLECTED:
          return { label: 'Add Estimate', style: 'primary', statusLabel: 'Action Required' };
        case ProjectStage.ESTIMATE_PROVIDED:
          return { label: 'Pending Approval', style: 'secondary', statusLabel: 'Client Action' };
        case ProjectStage.DESIGN_PHASE:
          return { label: 'Upload Design', style: 'primary', statusLabel: 'Needs Design' };
        case ProjectStage.SHIPPING_REQUEST:
          return { label: 'Confirm Shipping', style: 'primary', statusLabel: 'Logistics' };
        case ProjectStage.INSTALLATION:
          return { label: 'Update Progress', style: 'primary', statusLabel: 'On-Site Work' };
        default:
          return { label: 'View Details', style: 'ghost', statusLabel: 'In Progress' };
      }
    } else {
      switch (stage as any) {
        case ProjectStage.LEAD_COLLECTED:
          return { label: 'Fill details', style: 'primary', statusLabel: 'Awaiting Details' };
        case 'Estimate requested':
          return { label: 'Pending Review', style: 'ghost', statusLabel: 'Hrita Reviewing' };
        case 'Estimate ready':
          return { label: 'Review Estimate', style: 'primary', statusLabel: 'Estimate Prepared' };
        case 'Changes requested':
          return { label: 'Changes Sent', style: 'ghost', statusLabel: 'Revising Estimate' };
        case ProjectStage.ESTIMATE_PROVIDED:
          return { label: 'Review Estimate', style: 'primary', statusLabel: 'Awaiting Approval' };
        case ProjectStage.DESIGN_PHASE:
          return { label: 'Review Design', style: 'primary', statusLabel: '3D Views Ready' };
        case ProjectStage.BOOKING_PAYMENT:
          return { label: 'Make Payment', style: 'primary', statusLabel: 'Secure Gateway' };
        case ProjectStage.AGREEMENT_SIGNED:
          return { label: 'E-Sign Now', style: 'primary', statusLabel: 'Legal Check' };
        case ProjectStage.PROJECT_STARTED:
          return { label: 'Project Status', style: 'secondary', statusLabel: 'Procurement' };
        case ProjectStage.SHIPPING_REQUEST:
          return { label: 'Approve Shipping', style: 'primary', statusLabel: 'Payment Due' };
        case ProjectStage.SHIPPED:
          return { label: 'Track Order', style: 'secondary', statusLabel: 'In Transit' };
        case ProjectStage.INSTALLATION:
          return { label: 'Installation', style: 'secondary', statusLabel: 'On-Site Work' };
        case ProjectStage.POST_INSTALLATION:
          return { label: 'Final Payment', style: 'primary', statusLabel: 'System Live' };
        case ProjectStage.COMPLETED:
          return { label: 'Project Closed', style: 'ghost', statusLabel: 'Enjoy your home!' };
        default:
          return { label: 'Details', style: 'ghost', statusLabel: 'Active' };
      }
    }
  }

  // Handle current stage for Admin view
  if (stageIndex === currentIndex && isViewerAdmin) {
    switch (stage as any) {
      case 'Estimate requested':
        return { label: 'Add Estimate', style: 'primary', statusLabel: 'Details Received' };
      case 'Changes requested':
        return { label: 'Update Estimate', style: 'primary', statusLabel: 'Revisions Needed' };
      case 'Estimate ready':
        return { label: 'Estimate Sent', style: 'secondary', statusLabel: 'Awaiting Client' };
    }
  }

  return { label: 'Upcoming', style: 'ghost', statusLabel: 'Future Stage' };
};

const Timeline: React.FC<TimelineProps> = ({ currentStage, onAction, isViewerAdmin = false }) => {
  const allStages = Object.values(ProjectStage);
  // Find index by comparing values to handle potential string/enum mismatches
  const currentIndex = allStages.findIndex(s => s === currentStage);

  // Show stages up to current, in reverse order (newest on top)
  // If currentIndex is -1 (not found), default to showing everything or handle gracefully.
  // For safety, if not found, let's at least show the 'currentStage' if it's a valid string, or just all stages?
  // Let's assume if it matches nothing, we show nothing or just the first one. 
  // Better: If found, slice. If not, maybe it's a custom status?

  const endSlice = currentIndex !== -1 ? currentIndex + 1 : 1;
  const visibleStages = allStages.slice(0, endSlice).reverse();

  // Helper for status colors
  const getStatusStyle = (stage: string) => {
    switch (stage) {
      case 'Design Phase': return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50';
      case 'Estimate Provided': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'Project Completed': return 'bg-green-500/20 text-green-400 border-green-500/50';
      default: return 'bg-[#782e87]/20 text-[#d6bcfa] border-[#782e87]/50';
    }
  };

  return (
    <div className="space-y-6">
      {visibleStages.map((stage) => {
        const config = getStageConfig(stage, currentStage, isViewerAdmin);
        const isCurrent = stage === currentStage;

        // Mock data logic based on stage
        let projectType = "Residential Interior Design - 3BHK Apartment";
        let description = "Complete interior design for luxury apartment in Bandra West. Includes living room, bedrooms, kitchen, and balcony.";
        let amount = "₹4,50,000";
        let due = "₹2,50,000";
        let viewers = 3;

        if (stage === 'Design Phase') {
          projectType = "Design Phase"; // Match screenshot title
          description = "Concept 3.0: Contemporary Minimalist Theme with Italian Marble Flooring and Custom Walnut Paneling.";
          amount = "Draft Ready"; // Re-purposing amount column for Status text as per screenshot sort of? 
          // Wait, screenshot shows "Status: Draft Ready" under title. 
          // My card layout has Title, Description, and then Columns. 
          // Let's keep description. 
        }

        // Screenshot shows "Status: Draft Ready" under the title "Design Phase". 
        // My current card puts "Design Phase" as the stage label (top right). 
        // Screenshot has "Design Phase" as the MAIN TITLE. 
        // And "Status: Draft Ready" as subtitle.

        const isDesignStage = stage === 'Design Phase';

        const statusStyle = getStatusStyle(stage);

        return (
          <div
            key={stage}
            className={`
              bg-[#2E2B38] border border-[#4A4A5A] p-6 lg:p-8 rounded-[1.5rem] flex flex-col gap-6 
              hover:border-[#fafa33]/20 transition-all shadow-xl group relative overflow-hidden
              ${isCurrent ? 'ring-1 ring-[#fafa33]/20' : 'opacity-80 grayscale-[0.3] hover:grayscale-0 hover:opacity-100'}
            `}
          >
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="space-y-2 max-w-2xl">
                <h4 className="text-xl font-bold text-[#F5F7FA] font-rubik group-hover:text-[#fafa33] transition-colors">
                  {projectType}
                </h4>
                {isDesignStage ? (
                  <p className="text-xs font-black text-[#A0AEC0] uppercase tracking-widest">
                    Status: <span className="text-[#F5F7FA]">Draft Ready</span>
                  </p>
                ) : (
                  <p className="text-sm text-[#A0AEC0] leading-relaxed">
                    {description}
                  </p>
                )}
              </div>
              <span className={`px-4 py-2 rounded-lg text-xs font-bold border capitalize whitespace-nowrap ${statusStyle}`}>
                {stage}
              </span>
            </div>

            <div className="h-px bg-[#4A4A5A]/50 w-full" />

            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
              <div className="flex items-center gap-12">
                <div>
                  <p className="text-[10px] uppercase tracking-wider font-bold text-[#6c7079] mb-1">Amount</p>
                  <p className="text-lg font-bold text-[#F5F7FA]">{amount}</p>
                </div>
                <div className="hidden sm:block w-px h-8 bg-[#4A4A5A]" />
                <div>
                  <p className="text-[10px] uppercase tracking-wider font-bold text-[#6c7079] mb-1">Due</p>
                  <p className="text-lg font-bold text-[#d6bcfa]">{due}</p>
                </div>
                <div className="hidden sm:block w-px h-8 bg-[#4A4A5A]" />
                <div>
                  <p className="text-[10px] uppercase tracking-wider font-bold text-[#6c7079] mb-1">Viewers</p>
                  <p className="text-lg font-bold text-[#F5F7FA]">{viewers}</p>
                </div>
              </div>

              <div className="w-full sm:w-auto">
                {config.style !== 'ghost' && (
                  <button
                    onClick={() => onAction?.(stage)}
                    className={`
                          w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-lg flex items-center justify-center
                          ${config.style === 'primary'
                        ? 'bg-[#782e87] text-white hover:bg-[#8e3ba0] shadow-[#782e87]/20'
                        : 'bg-transparent border border-[#4A4A5A] text-[#F5F7FA] hover:bg-[#393645]'}
                        `}
                  >
                    {config.label}
                    {config.style === 'primary' && (
                      <svg className="w-3 h-3 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Timeline;
