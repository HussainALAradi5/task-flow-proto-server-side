import { TeamMention } from '../interface/team/TeamMention';

export function teamMentionError(content: string, requestedIds: string[], allowedIds: Set<string>, users: TeamMention[]): string | null {
  if (requestedIds.some((id) => !allowedIds.has(id))) return 'Mentions must be members of this team';
  const foundIds = new Set(users.map((user) => user.id));
  const visible = (name: string) => new RegExp(`(?:^|\\s)@${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?=$|\\s|[.,!?;:])`).test(content);
  if (users.length !== requestedIds.length || requestedIds.some((id) => !foundIds.has(id)) || users.some((user) => !visible(user.userName))) {
    return 'Mentioned members must appear in the message';
  }
  return null;
}
