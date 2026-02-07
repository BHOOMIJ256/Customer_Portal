import React from 'react';
import { WorkflowCard } from '../types/workflow';

interface HorizontalCardProps {
    card: WorkflowCard;
    isActive: boolean;
    isCompleted: boolean;
}

const HorizontalCard: React.FC<HorizontalCardProps> = ({ card, isActive, isCompleted }) => {
    const getStatusBadgeStyle = () => {
        if (isCompleted) {
            return 'bg-[#2E3B2E] text-emerald-400 border-emerald-500/30';
        }

        switch (card.status) {
            case 'not_requested':
                return 'bg-[#2E2E2E] text-gray-400 border-gray-500/30';
            case 'pending':
                return 'bg-[#3B3222] text-amber-400 border-amber-500/30';
            case 'created':
                return 'bg-[#2B323B] text-blue-400 border-blue-500/30';
            case 'approved':
            case 'paid':
            case 'completed':
                return 'bg-[#2E3B2E] text-emerald-400 border-emerald-500/30';
            case 'changes_requested':
                return 'bg-[#3B2222] text-red-400 border-red-500/30';
            case 'verification_pending':
                return 'bg-[#32223B] text-purple-400 border-purple-500/30';
            default:
                return 'bg-[#3B3B22] text-yellow-400 border-yellow-500/30';
        }
    };

    const getStatusLabel = () => {
        if (isCompleted) return 'COMPLETED';

        const statusLabels: Record<string, string> = {
            'not_requested': 'NOT REQUESTED',
            'pending': 'PENDING',
            'created': 'CREATED',
            'approved': 'APPROVED',
            'paid': 'PAID',
            'completed': 'COMPLETED',
            'changes_requested': 'CHANGES REQUESTED',
            'verification_pending': 'VERIFICATION PENDING'
        };

        return (statusLabels[card.status] || card.status).toUpperCase();
    };

    return (
        <div className={`relative bg-[#201D28] border border-[#3A3A4A] p-8 rounded-[2rem] flex flex-col group hover:border-[#fafa33]/20 transition-all ${isActive ? 'ring-1 ring-[#fafa33]/20' : ''
            } ${isCompleted ? 'opacity-80' : ''}`}>

            {/* Top Right Badge */}
            <div className="absolute top-8 right-8">
                <span className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-lg tracking-widest border transition-colors ${getStatusBadgeStyle()}`}>
                    {getStatusLabel()}
                </span>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="flex-1 space-y-4">
                    <div>
                        <h3 className="text-2xl font-black text-[#F5F7FA] font-rubik tracking-tight">
                            {card.subject}
                        </h3>
                        <p className="text-sm text-[#A0AEC0] leading-relaxed max-w-xl mt-2 font-medium">
                            {card.description}
                        </p>
                    </div>

                    {/* Metadata Section */}
                    {card.metadata && (
                        <div className="flex items-center space-x-12 pt-4">
                            {card.metadata.estimate && (
                                <>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-[#5A5A6A] font-black uppercase tracking-[0.2em] mb-1">
                                            Property
                                        </span>
                                        <span className="text-base font-bold text-[#F5F7FA]">
                                            {card.metadata.estimate.bhk} - {card.metadata.estimate.property_type}
                                        </span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-[#5A5A6A] font-black uppercase tracking-[0.2em] mb-1">
                                            Location
                                        </span>
                                        <span className="text-base font-bold text-[#F5F7FA]">
                                            {card.metadata.estimate.city}
                                        </span>
                                    </div>
                                </>
                            )}
                            {card.metadata.opportunity && card.metadata.opportunity.booking_amount > 0 && (
                                <>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-[#5A5A6A] font-black uppercase tracking-[0.2em] mb-1">
                                            Amount
                                        </span>
                                        <span className="text-base font-bold text-[#F5F7FA]">
                                            ₹{card.metadata.opportunity.booking_amount.toLocaleString()}
                                        </span>
                                    </div>
                                    {card.metadata.opportunity.payment_due > 0 && (
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-[#5A5A6A] font-black uppercase tracking-[0.2em] mb-1">
                                                Due
                                            </span>
                                            <span className="text-base font-bold text-amber-400">
                                                ₹{card.metadata.opportunity.payment_due.toLocaleString()}
                                            </span>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}
                </div>

                {/* Right Side Action */}
                <div className="w-full md:w-auto">
                    {card.action && (
                        <button
                            onClick={card.onAction}
                            className="w-full md:w-auto flex items-center justify-between md:justify-start space-x-4 bg-gradient-to-r from-[#782e87] to-[#9d3cb0] hover:from-[#8e3ba0] hover:to-[#b04cc8] text-white px-8 py-4 rounded-[1.25rem] text-sm font-black transition-all shadow-xl shadow-[#782e87]/20 active:scale-95 group/btn"
                        >
                            <span>View Details</span>
                            <svg className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HorizontalCard;
