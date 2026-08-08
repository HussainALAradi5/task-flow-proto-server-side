export enum UserRole {
  ADMIN = 'Admin',
  LEADER = 'Leader',
  MEMBER = 'Member',
}

export const UserRoleUI = {
  [UserRole.ADMIN]: { label: 'System Admin', color: 'bg-purple-100 text-purple-800 border-purple-200' },
  [UserRole.LEADER]: { label: 'Team Leader', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
  [UserRole.MEMBER]: { label: 'Team Member', color: 'bg-teal-100 text-teal-800 border-teal-200' },
};