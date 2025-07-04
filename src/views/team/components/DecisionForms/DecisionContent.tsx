// src/views/team/components/DecisionForms/DecisionContent.tsx
// UPDATED: Use unified DoubleDown component

import React from 'react';
import {Slide, InvestmentOption, ChallengeOption} from '@shared/types';
import {DecisionState, DecisionActions} from '@views/team/hooks/useDecisionMaking';
import InvestmentPanel from './InvestmentPanel';
import ChoicePanel from './ChoicePanel';
import DoubleDownPanel from './DoubleDownPanel'; // NEW: Unified component

interface DecisionContentProps {
    currentSlide: Slide;
    decisionState: DecisionState;
    decisionActions: DecisionActions;
    investmentOptions: InvestmentOption[];
    challengeOptions: ChallengeOption[];
    availableRd3Investments: InvestmentOption[];
    investUpToBudget: number;
    isSubmitting: boolean;
}

const DecisionContent: React.FC<DecisionContentProps> = ({
                                                             currentSlide,
                                                             decisionState,
                                                             decisionActions,
                                                             investmentOptions,
                                                             challengeOptions,
                                                             availableRd3Investments,
                                                             investUpToBudget,
                                                             isSubmitting
                                                         }) => {
    switch (currentSlide.type) {
        case 'interactive_invest':
            return (
                <InvestmentPanel
                    investmentOptions={investmentOptions}
                    selectedInvestmentIds={decisionState.selectedInvestmentOptions}
                    spentBudget={decisionState.spentBudget}
                    investUpToBudget={investUpToBudget}
                    onInvestmentToggleById={decisionActions.handleInvestmentToggleById}
                    onImmediatePurchase={decisionActions.handleImmediatePurchase}
                    isSubmitting={isSubmitting}
                    immediatePurchases={decisionState.immediatePurchases}
                />
            );
        case 'interactive_choice':
            return (
                <ChoicePanel
                    challengeOptions={challengeOptions}
                    selectedChallengeOptionId={decisionState.selectedChallengeOptionId}
                    onChallengeSelect={decisionActions.handleChallengeSelect}
                    currentSlide={currentSlide}
                    isSubmitting={isSubmitting}
                    forcedSelection={decisionState.forcedSelection}
                    forcedSelectionReason={decisionState.forcedSelectionReason}
                    isCheckingForcedSelection={decisionState.isCheckingForcedSelection}
                />
            );
        case 'interactive_double_down_select': {
            // Filter RD3 investments to only what team owns
            const teamRd3Letters = decisionState.immediatePurchases || [];
            const teamOwnedInvestments = availableRd3Investments.filter(inv => {
                return teamRd3Letters.includes(inv.id);
            });

            // NEW: Single unified component handles entire double down flow
            return (
                <DoubleDownPanel
                    challengeOptions={challengeOptions}
                    availableRd3Investments={teamOwnedInvestments}
                    selectedChallengeOptionId={decisionState.selectedChallengeOptionId}
                    sacrificeInvestmentId={decisionState.sacrificeInvestmentId}
                    doubleDownOnInvestmentId={decisionState.doubleDownOnInvestmentId}
                    onChallengeSelect={decisionActions.handleChallengeSelect}
                    onSacrificeChange={decisionActions.handleSacrificeSelect}
                    onDoubleDownChange={decisionActions.handleDoubleDownSelect}
                    isSubmitting={isSubmitting}
                />
            );
        }
        default:
            return (
                <div className="text-center text-gray-400">
                    <p>No content available for this slide type.</p>
                </div>
            );
    }
};

export default DecisionContent;
