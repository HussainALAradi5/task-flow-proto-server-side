export interface CreateProjectDto {
  title: string;
  description?: string;
  teamId?: string;
}

export interface UpdateProjectDto {
  title?: string;
  description?: string;
  teamId?: string;
}
