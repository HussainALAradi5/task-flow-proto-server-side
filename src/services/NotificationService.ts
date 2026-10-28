import { Types } from 'mongoose';
import { Notification } from '../models/Notification';
import { NotificationKind } from '../enums/NotificationKind';
import { Team } from '../models/team/Team';
import { Project } from '../models/project/Project';
import { Task } from '../models/project/Task';
import { Milestone } from '../models/project/Milestone';
import { EntityType } from '../enums/EntityType';

function recipients(owner: unknown, members: unknown[], actorId?: string): string[] {
  return [...new Set([owner, ...members].filter(Boolean).map((value) => String(value)))]
    .filter((id) => id !== actorId && Types.ObjectId.isValid(id));
}

async function createMany(userIds: string[], kind: NotificationKind, title: string, description: string, href: string): Promise<void> {
  if (!userIds.length) return;
  await Notification.insertMany(userIds.map((recipient) => ({ recipient, kind, title, description, href, readAt: null })));
}

export const NotificationService = {
  async invitation(userId: string, teamName: string): Promise<void> {
    await createMany([userId], NotificationKind.Invitation, 'Team invitation', `You were invited to ${teamName}.`, '/teams');
  },

  async memberRemoved(userId: string, teamName: string): Promise<void> {
    await createMany([userId], NotificationKind.Activity, 'Team access removed', `Your access to ${teamName} and its boards was removed.`, '/teams');
  },

  async teamMessage(teamId: string, teamName: string, owner: unknown, members: unknown[], actorId: string, mentionedIds: string[] = []): Promise<void> {
    const allowedRecipients = recipients(owner, members, actorId);
    const mentioned = allowedRecipients.filter((id) => mentionedIds.includes(id));
    const others = allowedRecipients.filter((id) => !mentioned.includes(id));
    await Promise.all([
      createMany(mentioned, NotificationKind.Message, 'You were mentioned', `You were mentioned in ${teamName}.`, `/teams?chat=${teamId}`),
      createMany(others, NotificationKind.Message, 'New team message', `New message in ${teamName}.`, `/teams?chat=${teamId}`),
    ]);
  },

  async activity(title: string, entityType: EntityType, entityId: string, description: string, actorId?: string): Promise<void> {
    if (entityType === EntityType.USER) return;
    if (entityType === EntityType.TEAM) {
      const team = await Team.findById(entityId);
      if (team) await createMany(recipients(team.createdBy, team.members, actorId), NotificationKind.Activity, title, description, '/teams');
      return;
    }
    let projectId = entityId;
    if (entityType === EntityType.TASK) projectId = (await Task.findById(entityId))?.projectId?.toString() || '';
    if (entityType === EntityType.MILESTONE) projectId = (await Milestone.findById(entityId))?.projectId?.toString() || '';
    if (!projectId) return;
    const project = await Project.findById(projectId);
    if (project) await createMany(recipients(project.createdBy, project.members, actorId), NotificationKind.Activity, title, description, `/board/${project.slug}`);
  },
};
