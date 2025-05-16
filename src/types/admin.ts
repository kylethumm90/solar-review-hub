
export interface AdminLog {
  id: string;
  admin_user_id: string;
  action_type: string;
  target_entity: string;
  target_id: string;
  details?: Record<string, any>;
  timestamp: string;
  admin?: {
    email?: string;
    full_name?: string;
  };
}
