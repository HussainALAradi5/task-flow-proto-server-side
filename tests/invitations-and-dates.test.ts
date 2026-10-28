import { test } from 'node:test';
import assert from 'node:assert/strict';
import app from '../src/app';
import { taskDateError } from '../src/utilities/taskDates';
import { createTaskSchema, updateTaskSchema } from '../src/validations/task.schema';
import { UserService } from '../src/services/user/UserService';
import { signToken } from '../src/utilities/auth';
import { createCommentSchema } from '../src/validations/comment.schema';
import { createTeamMessageSchema } from '../src/validations/teamMessage.schema';
import { teamMentionError } from '../src/utilities/teamMentions';
import { Team } from '../src/models/team/Team';
import { User } from '../src/models/user/User';
import { TeamMessage } from '../src/models/team/TeamMessage';

test('task timeline rejects dates before creation and out of sequence', () => {
  const created = new Date('2026-10-27T08:00:00Z');
  assert.match(taskDateError({ deliveredDate: new Date('2026-10-26') }, created)!, /creation/);
  assert.match(taskDateError({ startDate: new Date('2026-10-28'), deliveredDate: new Date('2026-10-27') }, created)!, /start/);
  assert.equal(taskDateError({ startDate: new Date('2026-10-27'), targetDate: new Date('2026-10-29'), deliveredDate: new Date('2026-10-30') }, created), null);
  assert.equal(updateTaskSchema.safeParse({ params: { id: '6a0000000000000000000001' }, body: { deliveredDate: null } }).success, true);
  assert.equal(createTaskSchema.safeParse({ body: { title: 'Card', projectId: '6a0000000000000000000001', startDate: 'yesterday' } }).success, false);
});

test('team invitation routes require login and valid input before owner lookup', async () => {
  const original = UserService.getById;
  let role = 'Member';
  UserService.getById = async () => ({ id: '6a0000000000000000000001', role, isActive: true }) as never;
  const server = app.listen(0);
  try {
    const address = server.address();
    assert.ok(address && typeof address !== 'string');
    const base = `http://127.0.0.1:${address.port}`;
    const path = '/api/teams/6a0000000000000000000002/members';
    assert.equal((await fetch(base + path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' })).status, 401);
    const headers = { Authorization: `Bearer ${signToken('6a0000000000000000000001')}`, 'Content-Type': 'application/json' };
    assert.equal((await fetch(base + path, { method: 'POST', headers, body: JSON.stringify({ email: 'bad' }) })).status, 400);
    role = 'Leader';
    assert.equal((await fetch(base + path, { method: 'POST', headers, body: JSON.stringify({ email: 'bad' }) })).status, 400);
    assert.equal((await fetch(base + '/api/teams/invitations/bad/respond', { method: 'POST', headers, body: JSON.stringify({ decision: 'accept' }) })).status, 400);
  } finally {
    UserService.getById = original;
    server.close();
  }
});

test('discussion accepts only small verified images and text', () => {
  const taskId = '6a0000000000000000000001';
  const gif = 'data:image/gif;base64,' + Buffer.from('GIF89a\x01\x00\x01\x00').toString('base64');
  assert.equal(createCommentSchema.safeParse({ body: { content: '', attachment: gif, taskId } }).success, true);
  assert.equal(createCommentSchema.safeParse({ body: { content: '   ', taskId } }).success, false);
  assert.equal(createCommentSchema.safeParse({ body: { content: '', attachment: 'data:image/svg+xml;base64,PHN2Zz4=', taskId } }).success, false);
  assert.equal(createCommentSchema.safeParse({ body: { content: '', attachment: 'data:image/gif;base64,' + Buffer.from('not a gif').toString('base64'), taskId } }).success, false);
});

test('team chat accepts verified files and rejects unsafe attachments and mentions', () => {
  const params = { id: '6a0000000000000000000001' };
  const pdf = 'data:application/pdf;base64,' + Buffer.from('%PDF-1.7\nexample').toString('base64');
  const text = 'data:text/plain;base64,' + Buffer.from('Team notes').toString('base64');
  const body = { content: '', attachment: pdf, attachmentName: 'plan.pdf', mentions: [] };
  assert.equal(createTeamMessageSchema.safeParse({ params, body }).success, true);
  assert.equal(createTeamMessageSchema.safeParse({ params, body: { content: '', attachment: text, attachmentName: 'notes.txt' } }).success, true);
  assert.equal(createTeamMessageSchema.safeParse({ params, body: { ...body, attachmentName: 'plan.html' } }).success, false);
  assert.equal(createTeamMessageSchema.safeParse({ params, body: { ...body, attachment: 'data:application/pdf;base64,' + Buffer.from('<html>').toString('base64') } }).success, false);
  assert.equal(createTeamMessageSchema.safeParse({ params, body: { content: '@member', mentions: ['outside'] } }).success, false);
});

test('team mentions cannot notify outsiders or omit the visible username', () => {
  const allowed = new Set(['6a0000000000000000000001']);
  const member = { id: '6a0000000000000000000001', userName: 'teammate' };
  assert.equal(teamMentionError('Hi @teammate', [member.id], allowed, [member]), null);
  assert.match(teamMentionError('Hi @teammate', ['6a0000000000000000000002'], allowed, [] )!, /members/);
  assert.match(teamMentionError('Hi everyone', [member.id], allowed, [member])!, /appear/);
  assert.match(teamMentionError('Hi @teammate', [member.id], allowed, [])!, /appear/);
  assert.match(teamMentionError('Hi @teammateExtra', [member.id], allowed, [member])!, /appear/);
});

test('team message route rejects mentions outside the team before writing', async () => {
  const originalGetById = UserService.getById;
  const originalTeamFind = Team.findById;
  const originalUserFind = User.find;
  const originalCreate = TeamMessage.create;
  const actor = '6a0000000000000000000001';
  const member = '6a0000000000000000000002';
  const outsider = '6a0000000000000000000003';
  let wrote = false;
  UserService.getById = async () => ({ id: actor, role: 'Leader', isActive: true }) as never;
  Team.findById = (async () => ({ _id: member, id: member, name: 'Team', isActive: true, createdBy: actor, members: [member] })) as never;
  User.find = (() => ({ select: () => ({ lean: async () => [{ _id: member, userName: 'teammate' }] }) })) as never;
  TeamMessage.create = (async () => { wrote = true; throw new Error('Unexpected write'); }) as never;
  const server = app.listen(0);
  try {
    const address = server.address();
    assert.ok(address && typeof address !== 'string');
    const endpoint = `http://127.0.0.1:${address.port}/api/teams/${member}/messages`;
    const headers = { Authorization: `Bearer ${signToken(actor)}`, 'Content-Type': 'application/json' };
    assert.equal((await fetch(endpoint, { method: 'POST', headers, body: JSON.stringify({ content: 'Hi @outsider', mentions: [outsider] }) })).status, 400);
    assert.equal((await fetch(endpoint, { method: 'POST', headers, body: JSON.stringify({ content: 'Hi there', mentions: [member] }) })).status, 400);
    assert.equal(wrote, false);
  } finally {
    UserService.getById = originalGetById;
    Team.findById = originalTeamFind;
    User.find = originalUserFind;
    TeamMessage.create = originalCreate;
    server.close();
  }
});
