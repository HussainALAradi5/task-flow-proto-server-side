import { ITask } from '../interface/project/Task';

type DateFields = Pick<ITask, 'startDate' | 'targetDate' | 'endDate' | 'deliveredDate'>;

export function taskDateError(dates: Partial<DateFields>, createdAt: Date): string | null {
  const day = (value: Date | string | null | undefined) => value ? new Date(value).toISOString().slice(0, 10) : null;
  const created = day(createdAt)!;
  const fields: Array<[keyof DateFields, string]> = [
    ['startDate', 'Start'], ['targetDate', 'Target'], ['endDate', 'End'], ['deliveredDate', 'Delivery'],
  ];
  let previous = created;
  let previousName = 'task creation';
  for (const [key, label] of fields) {
    const current = day(dates[key]);
    if (!current) continue;
    if (current < previous) return `${label} date cannot be before ${previousName} date`;
    previous = current;
    previousName = label.toLowerCase();
  }
  return null;
}
