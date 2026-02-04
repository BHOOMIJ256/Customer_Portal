
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
      switch (stage) {
        case ProjectStage.LEAD_COLLECTED:
          return { label: 'Request Sent', style: 'ghost', statusLabel: 'Processing' };
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

  return { label: 'Upcoming', style: 'ghost', statusLabel: 'Future Stage' };
};

const Timeline: React.FC<TimelineProps> = ({ currentStage, onAction, isViewerAdmin = false }) => {
  const allStages = Object.values(ProjectStage);
  const currentIndex = allStages.indexOf(currentStage);

  // Show stages up to current, in reverse order (newest on top)
  const visibleStages = allStages.slice(0, currentIndex + 1).reverse();

  return (
    <div className="space-y-4">
      {visibleStages.map((stage) => {
        const config = getStageConfig(stage, currentStage, isViewerAdmin);
        const isCurrent = stage === currentStage;
        const isPast = allStages.indexOf(stage) < currentIndex;

        return (
          <div
            key={stage}
            className={`
              group flex flex-col sm:flex-row items-start sm:items-center justify-between 
              p-6 rounded-[2rem] border transition-all duration-300
              ${isCurrent ? 'bg-[#2E2B38] border-[#4A4A5A] ring-1 ring-[#fafa33]/20 shadow-2xl shadow-black/40' : 'bg-[#2E2B38]/40 border-transparent'}
            `}
          >
            <div className="flex items-center space-x-6 mb-5 sm:mb-0">
              <div className={`
                w-3 h-3 rounded-full ring-4 
                ${isPast ? 'bg-[#782e87] ring-[#782e87]/20 shadow-sm' : isCurrent ? 'bg-[#fafa33] ring-[#fafa33]/20 shadow-md animate-pulse' : 'bg-[#4A4A5A] ring-[#4A4A5A]/20'}
              `} />
              <div>
                <h4 className={`text-[16px] font-bold tracking-tight font-rubik ${isCurrent ? 'text-[#F5F7FA]' : 'text-[#A0AEC0]'}`}>
                  {stage}
                </h4>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#A0AEC0] font-black mt-1">
                  {config.statusLabel}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
              {isPast ? (
                <div className="flex items-center text-[#782e87] text-[11px] font-black px-4 py-2 bg-[#782e87]/10 rounded-xl tracking-widest uppercase border border-[#782e87]/20">
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                  Verified
                </div>
              ) : (
                <button
                  onClick={() => onAction?.(stage)}
                  // Disable button if it's a passive status for the role
                  disabled={config.style === 'secondary' || config.style === 'ghost'}
                  className={`
                  px-7 py-3 rounded-2xl text-[13px] font-black transition-all active:scale-95 shadow-lg font-rubik flex items-center
                  ${config.style === 'primary'
                      ? 'bg-[#782e87] text-white hover:bg-[#8e3ba0] shadow-black/20'
                      : 'bg-transparent border border-[#4A4A5A] text-[#F5F7FA] hover:bg-[#24212b] opacity-80 cursor-default'}
                `}>
                  {config.label}
                  {config.style === 'primary' && (
                    <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Timeline;
