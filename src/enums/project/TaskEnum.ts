export enum TaskPriority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  CRITICAL = 'Critical',
}

export const TaskPriorityUI = {
  [TaskPriority.LOW]: { label: 'Low', color: 'bg-gray-100 text-gray-600 border-gray-200' },
  [TaskPriority.MEDIUM]: { label: 'Medium', color: 'bg-sky-100 text-sky-700 border-sky-200' },
  [TaskPriority.HIGH]: { label: 'High', color: 'bg-orange-100 text-orange-700 border-orange-200' },
  [TaskPriority.CRITICAL]: { label: 'Critical', color: 'bg-red-100 text-red-700 border-red-200' },
};