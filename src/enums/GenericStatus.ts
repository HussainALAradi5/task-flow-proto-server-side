export enum GenericStatus {
  TODO = 'To Do',
  IN_PROGRESS = 'In Progress',
  IN_REVIEW = 'In Review',
  DONE = 'Done',
}

export const GenericStatusUI = {
  [GenericStatus.TODO]: { label: 'To Do', color: 'bg-slate-100 text-slate-800 border-slate-200' },
  [GenericStatus.IN_PROGRESS]: { label: 'In Progress', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  [GenericStatus.IN_REVIEW]: { label: 'In Review', color: 'bg-amber-100 text-amber-800 border-amber-200' },
  [GenericStatus.DONE]: { label: 'Done', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
};