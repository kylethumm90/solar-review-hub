
import { ModerationActionsProps } from './ModerationActionsTypes';
import ReviewModerationActions from './ReviewModerationActions';
import ClaimModerationActions from './ClaimModerationActions';

/**
 * Router component that delegates to the appropriate type-specific moderation action component
 */
const ModerationActions = (props: ModerationActionsProps) => {
  if (props.type === 'review') {
    return <ReviewModerationActions {...props} />;
  }
  
  if (props.type === 'claim') {
    return <ClaimModerationActions {...props} />;
  }
  
  return null;
};

export default ModerationActions;
