import { test } from 'node:test';
import assert from 'node:assert/strict';
import app from '../src/app';
import { taskDateError } from '../src/utilities/taskDates';
import { createTaskSchema, updateTaskSchema } from '../src/validations/task.schema';
import { UserService } from '../src/services/user/UserService';
import { signToken } from '../src/utilities/auth';
import { createCommentSchema } from '../src/validations/comment.schema';

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
