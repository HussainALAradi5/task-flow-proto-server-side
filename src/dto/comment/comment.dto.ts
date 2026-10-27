export interface CreateCommentDto {
  content: string;
  attachment?: string;
  taskId: string;
}

export interface UpdateCommentDto {
  content: string;
}
