export enum EntityType {
  USER = 'User',
  TEAM = 'Team',
  TASK = 'Task',
  PROJECT = 'Project',
  MILESTONE = 'Milestone',
}

export const EntityTypeUI = {
  [EntityType.USER]: { label: 'User Record', color: 'bg-cyan-100 text-cyan-800 border-cyan-200' },
  [EntityType.TEAM]: { label: 'Team Record', color: 'bg-violet-100 text-violet-800 border-violet-200' },
  [EntityType.TASK]: { label: 'Task Record', color: 'bg-rose-100 text-rose-800 border-rose-200' },
  [EntityType.PROJECT]: { label: 'Project Record', color: 'bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200' },
  [EntityType.MILESTONE]: { label: 'Milestone Record', color: 'bg-lime-100 text-lime-800 border-lime-200' },
};