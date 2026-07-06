export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  currentPlan: 'plan-free' | 'plan-premium' | 'plan-vip';
  isAdmin?: boolean;
  joinedDate: string;
  isEmailVerified: boolean;
  token?: string;
}

export const mockUserProfile: UserProfile = {
  id: 'usr-481',
  name: 'Sarah & Alexander',
  email: 'celebration@sarahandalex.com',
  avatar: '/avatar-placeholder.svg',
  currentPlan: 'plan-premium',
  joinedDate: 'July 1, 2026',
  isEmailVerified: true
};
