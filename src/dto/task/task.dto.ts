import { GenericStatus } from '../../enums/GenericStatus';
import { TaskPriority } from '../../enums/project/TaskPriority';

export interface CreateTaskDto {
  title: string;
  description?: string;
  status?: GenericStatus;
  priority?: TaskPriority;
  projectId: string;
  milestoneId?: string;
  assignTo?: string;
  startDate?: string;
  targetDate?: string;
  endDate?: string;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  status?: GenericStatus;
  priority?: TaskPriority;
  milestoneId?: string;
  assignTo?: string;
  startDate?: string;
  targetDate?: string;
  endDate?: string;
}
