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
  statusLabel: string;
  category: string;
  role: string;
  hasAction: boolean;
}

const getStageConfig = (stage: ProjectStage, currentStage: ProjectStage, isViewerAdmin: boolean): StageAction => {
  const allStages = Object.values(ProjectStage);
  const currentIndex = allStages.indexOf(currentStage);
  const stageIndex = allStages.indexOf(stage);

  const base = { category: 'Project Update', role: 'Hrita Admin' };

  if (stageIndex < currentIndex) {
    return {
      label: 'Verified',
      style: 'ghost',
      statusLabel: 'Completed',
      hasAction: false,
      ...base
    };
  }

  if (stageIndex === currentIndex) {
    if (isViewerAdmin) {
      // Admin Actions
      switch (stage) {
        case ProjectStage.LEAD_COLLECTED:
          return { label: 'Add Estimate', style: 'primary', statusLabel: 'Action Required', category: 'Sales', role: 'System', hasAction: true };
        case ProjectStage.ESTIMATE_PROVIDED:
          return { label: 'Pending Approval', style: 'secondary', statusLabel: 'Client Action', category: 'Estimation', role: 'Client', hasAction: false };
        default:
          return { label: 'View Details', style: 'ghost', statusLabel: 'In Progress', category: 'Management', role: 'Admin', hasAction: true };
      }
    } else {
      // Client Actions
      switch (stage) {
        case ProjectStage.LEAD_COLLECTED:
          return { label: 'Request Sent', style: 'ghost', statusLabel: 'Processing', category: 'Inquiry', role: 'System', hasAction: false };
        case ProjectStage.ESTIMATE_PROVIDED:
          return { label: 'Review Estimate', style: 'primary', statusLabel: 'Awaiting User', category: 'Costing', role: 'Senior Architect', hasAction: true };
        case ProjectStage.DESIGN_PHASE:
          return { label: 'Review Design', style: 'primary', statusLabel: '3D Views Ready', category: 'Design', role: 'Design Lead', hasAction: true };
        case ProjectStage.BOOKING_PAYMENT:
          return { label: 'Make Payment', style: 'primary', statusLabel: 'Payment Due', category: 'Accounts', role: 'Finance', hasAction: true };
        case ProjectStage.AGREEMENT_SIGNED:
          return { label: 'E-Sign Now', style: 'primary', statusLabel: 'Legal Check', category: 'Legal', role: 'Legal Team', hasAction: true };
        case ProjectStage.SITE_VISIT:
          return { label: 'View Report', style: 'secondary', statusLabel: 'Site Checked', category: 'Operations', role: 'Site Engineer', hasAction: true };
        case ProjectStage.PROJECT_STARTED:
          return { label: 'Project Status', style: 'secondary', statusLabel: 'Procurement', category: 'Execution', role: 'Project Manager', hasAction: true };
        case ProjectStage.IN_PROGRESS:
          return { label: 'Pay Installment', style: 'primary', statusLabel: 'Construction', category: 'Finance', role: 'Accounts', hasAction: true };
        default:
          return { label: 'Details', style: 'ghost', statusLabel: 'Active', category: 'General', role: 'Admin', hasAction: true };
      }
    }
  }

  return { label: 'Upcoming', style: 'ghost', statusLabel: 'Scheduled', category: 'Planning', role: 'System', hasAction: false };
};

const Timeline: React.FC<TimelineProps> = ({ currentStage, onAction, isViewerAdmin = false }) => {
  const allStages = Object.values(ProjectStage);
  const currentIndex = allStages.indexOf(currentStage);

  // Show stages up to current, in reverse order (newest on top)
  const visibleStages = allStages.slice(0, currentIndex + 1).reverse();

  return (
    <div className="space-y-4">
      {visibleStages.map((stage, idx) => {
        const config = getStageConfig(stage, currentStage, isViewerAdmin);
        const isCurrent = stage === currentStage;
        const isPast = allStages.indexOf(stage) < currentIndex;

        // Mock time for demo "LinkedIn style"
        const timeAgo = isCurrent ? '2h • Edited' : isPast ? `${idx + 1}d ago` : 'Upcoming';

        return (
          <div
            key={stage}
            className={`
              flex flex-col sm:flex-row gap-4 p-5 rounded-[1.5rem] border transition-all duration-300
              ${isCurrent ? 'bg-[#2E2B38] border-[#4A4A5A] shadow-xl' : 'bg-[#2E2B38]/30 border-transparent hover:bg-[#2E2B38]/50'}
            `}
          >
            {/* Avatar / Icon Section */}
            <div className="flex-shrink-0">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 
                    ${isCurrent ? 'bg-[#fafa33] border-[#fafa33]/50 text-[#24212b]' : 'bg-[#4A4A5A]/30 border-[#4A4A5A] text-[#A0AEC0]'}
                `}>
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {config.category === 'Design' ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  ) : config.category === 'Costing' || config.category === 'Accounts' ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  )}
                </svg>
              </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col">
                <h4 className={`text-base font-bold font-rubik leading-tight ${isCurrent ? 'text-[#F5F7FA]' : 'text-[#A0AEC0]'}`}>
                  {config.role} <span className="text-[#A0AEC0] font-normal text-sm mx-1">updated the status to</span> {stage}
                </h4>
                <p className="text-xs text-[#A0AEC0] mt-1 flex items-center font-medium">
                  {config.category}
                  <span className="mx-1.5 opacity-50">•</span>
                  {config.statusLabel}
                  <span className="mx-1.5 opacity-50">•</span>
                  {timeAgo}
                </p>
              </div>

              {/* Description Snippet (Mock) */}
              {isCurrent && (
                <div className="mt-3 bg-[#24212b]/50 rounded-xl p-3 border border-[#4A4A5A]/30 mb-2">
                  <p className="text-sm text-[#F5F7FA] italic leading-relaxed">
                    " {config.category === 'Design' ? 'Initial 3D views uploaded for review.' : config.category === 'Sales' ? 'Proposal generated.' : 'Awaiting confirmation.'} "
                  </p>
                </div>
              )}
            </div>

            {/* Action Section */}
            <div className="flex items-start pt-1">
              {isPast ? (
                <div className="text-[#782e87] hover:bg-[#782e87]/10 p-2 rounded-lg transition-colors cursor-pointer" title="Verified">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              ) : config.hasAction && (
                <button
                  onClick={() => onAction?.(stage)}
                  disabled={config.style === 'secondary' || config.style === 'ghost'}
                  className={`
                   px-6 py-2.5 rounded-full text-xs font-bold transition-all active:scale-95 shadow-lg font-rubik flex items-center whitespace-nowrap
                   ${config.style === 'primary'
                      ? 'bg-[#782e87] text-white hover:bg-[#8e3ba0] shadow-black/20 ring-2 ring-white/5'
                      : 'bg-[#2E2B38] border border-[#4A4A5A] text-[#F5F7FA] hover:bg-[#393645]'}
                `}>
                  {config.label}
                  {config.style === 'primary' && (
                    <svg className="w-3 h-3 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
