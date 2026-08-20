export interface CreateMilestoneDto {
  name: string;
  projectId: string;
}

export interface UpdateMilestoneDto {
  name?: string;
}
