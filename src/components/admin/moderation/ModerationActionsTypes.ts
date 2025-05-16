
/**
 * Common types for moderation action components
 */

export type ModerationEntityType = 'review' | 'claim';

export interface BaseModerationProps {
  id: string;
  onActionComplete: () => void;
}

export interface ReviewModerationProps extends BaseModerationProps {
  type: 'review';
}

export interface ClaimModerationProps extends BaseModerationProps {
  type: 'claim';
  companyId?: string;
  userId?: string;
}

export type ModerationActionsProps = ReviewModerationProps | ClaimModerationProps;
