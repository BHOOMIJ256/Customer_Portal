
import React from 'react';
import { SegmentType } from '../types';

const segments: SegmentType[] = ['Recents', 'Consultation', 'Payments', 'Invoices', 'My Documents', 'Tickets'];

interface SegmentLinksProps {
  activeSegment: SegmentType;
  onSegmentChange: (segment: SegmentType) => void;
}

const SegmentLinks: React.FC<SegmentLinksProps> = ({ activeSegment, onSegmentChange }) => {
  return (
    <div className="flex flex-wrap items-center justify-start text-[#A0AEC0] overflow-x-auto whitespace-nowrap scrollbar-hide py-2">
      {segments.map((segment, index) => (
        <React.Fragment key={segment}>
          <button
            onClick={() => onSegmentChange(segment)}
            className={`text-[18px] font-bold transition-all py-1.5 px-0.5 tracking-tight font-rubik outline-none ${activeSegment === segment ? 'text-[#fafa33]' : 'hover:text-[#fafa33]/70'
              }`}
          >
            {segment}
          </button>
          {index < segments.length - 1 && (
            <span className="mx-6 text-[#4A4A5A] select-none font-thin text-lg">|</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default SegmentLinks;
