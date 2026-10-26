import { test } from 'node:test';
import assert from 'node:assert/strict';
import app from '../src/app';
import { UserService } from '../src/services/user/UserService';
import { signToken } from '../src/utilities/auth';
import { updateUserSchema } from '../src/validations/user.schema';
import { ProjectService } from '../src/services/project/ProjectService';
import { Project } from '../src/models/project/Project';
import { EventService } from '../src/services/EventService';
import { TaskService } from '../src/services/project/TaskService';

test('write routes enforce roles and validation before database access', async () => {
  const original = UserService.getById;
  UserService.getById = async () => ({ id: '6a0000000000000000000001', role: 'Member', isActive: true }) as never;
  const server = app.listen(0);
  try {
    const address = server.address();
    assert.ok(address && typeof address !== 'string');
    const base = `http://127.0.0.1:${address.port}`;
    const headers = { Authorization: `Bearer ${signToken('6a0000000000000000000001')}`, 'Content-Type': 'application/json' };
    const cases: [string, string, number][] = [
      ['DELETE', '/api/projects/6a0000000000000000000003', 403],
      ['POST', '/api/teams', 403],
      ['POST', '/api/milestones', 403],
      ['POST', '/api/events', 404],
      ['POST', '/api/projects', 400],
      ['POST', '/api/tasks', 400],
    ];
    for (const [method, path, expected] of cases) {
      const response = await fetch(base + path, { method, headers, body: method === 'DELETE' ? undefined : '{}' });
      assert.equal(response.status, expected, `${method} ${path}`);
    }
    const profile = await fetch(base + '/api/users/profile', { method: 'PATCH', headers, body: JSON.stringify({ userName: 'a' }) });
    assert.equal(profile.status, 400);
    assert.equal(updateUserSchema.safeParse({ body: { userName: 'Demo User' }, params: {} }).success, true);
    const media = await fetch(base + '/api/media', { method: 'POST', headers, body: '{}' });
    assert.equal(media.status, 404);
  } finally {
    UserService.getById = original;
    server.close();
  }
});

test('project activity is readable by a board member or Admin, but not an outsider', async () => {
  const originalUserLookup = UserService.getById;
  const originalProjectLookup = Project.findById;
  const originalHistory = EventService.getProjectHistory;
  let role = 'Leader';
  UserService.getById = async () => ({ id: '6a0000000000000000000001', role, isActive: true }) as never;
  Project.findById = (() => Promise.resolve({ id: '6a0000000000000000000003', createdBy: '6a0000000000000000000099' })) as typeof Project.findById;
  EventService.getProjectHistory = async () => ({
    data: [{ _id: '6a0000000000000000000010', title: 'Task moved', description: 'Moved card to Done', createdAt: new Date('2026-10-26T10:00:00Z') }],
    pagination: { page: 1, limit: 10, total: 1, totalPages: 1 },
  }) as never;
  const server = app.listen(0);
  try {
    const address = server.address();
    assert.ok(address && typeof address !== 'string');
    const base = `http://127.0.0.1:${address.port}`;
    const headers = { Authorization: `Bearer ${signToken('6a0000000000000000000001')}` };
    const forbidden = await fetch(base + '/api/events/project/6a0000000000000000000003', { headers });
    assert.equal(forbidden.status, 404);
    role = 'Member';
    Project.findById = (() => Promise.resolve({ id: '6a0000000000000000000003', createdBy: '6a0000000000000000000099', members: ['6a0000000000000000000001'] })) as typeof Project.findById;
    const member = await fetch(base + '/api/events/project/6a0000000000000000000003', { headers });
    assert.equal(member.status, 200);
    role = 'Admin';
    const allowed = await fetch(base + '/api/events/project/6a0000000000000000000003', { headers });
    assert.equal(allowed.status, 200);
    assert.equal((await allowed.json()).data[0].title, 'Task moved');
  } finally {
    UserService.getById = originalUserLookup;
    Project.findById = originalProjectLookup;
    EventService.getProjectHistory = originalHistory;
    server.close();
  }
});

test('a Leader cannot read or update a project owned by another user', async () => {
  const originalUserLookup = UserService.getById;
  const originalProjectLookup = ProjectService.getById;
  const originalSlugLookup = ProjectService.getBySlug;
  UserService.getById = async () => ({ id: '6a0000000000000000000001', role: 'Leader', isActive: true }) as never;
  ProjectService.getById = async () => ({ id: '6a0000000000000000000003', createdBy: '6a0000000000000000000099', isActive: true }) as never;
  ProjectService.getBySlug = async () => ({ id: '6a0000000000000000000003', createdBy: '6a0000000000000000000099', isActive: true }) as never;
  const server = app.listen(0);
  try {
    const address = server.address();
    assert.ok(address && typeof address !== 'string');
    const base = `http://127.0.0.1:${address.port}`;
    const headers = { Authorization: `Bearer ${signToken('6a0000000000000000000001')}`, 'Content-Type': 'application/json' };
    const read = await fetch(base + '/api/projects/6a0000000000000000000003', { headers });
    assert.equal(read.status, 404);
    const slug = await fetch(base + '/api/projects/slug/private-project', { headers });
    assert.equal(slug.status, 404);
    const update = await fetch(base + '/api/projects/6a0000000000000000000003', { method: 'PATCH', headers, body: JSON.stringify({ title: 'Hijacked' }) });
    assert.equal(update.status, 404);
  } finally {
    UserService.getById = originalUserLookup;
    ProjectService.getById = originalProjectLookup;
    ProjectService.getBySlug = originalSlugLookup;
    server.close();
  }
});

test('a Member sees cards on another owner\'s board only when listed as a member', async () => {
  const originalUserLookup = UserService.getById;
  const originalProjectLookup = Project.findById;
  const originalTaskList = TaskService.getAllPaginated;
  let members: string[] = [];
  UserService.getById = async () => ({ id: '6a0000000000000000000008', role: 'Member', isActive: true }) as never;
  Project.findById = (() => Promise.resolve({ id: '6a000000000000000000000a', createdBy: '6a0000000000000000000007', members })) as typeof Project.findById;
  TaskService.getAllPaginated = async () => ({ data: [{ title: 'Admin card', createdBy: '6a0000000000000000000007' }], pagination: { page: 1, limit: 10, total: 1, totalPages: 1 } }) as never;
  const server = app.listen(0);
  try {
    const address = server.address();
    assert.ok(address && typeof address !== 'string');
    const path = `http://127.0.0.1:${address.port}/api/tasks/project/6a000000000000000000000a`;
    const headers = { Authorization: `Bearer ${signToken('6a0000000000000000000008')}` };
    assert.equal((await fetch(path, { headers })).status, 404);
    members = ['6a0000000000000000000008'];
    const response = await fetch(path, { headers });
    assert.equal(response.status, 200);
    assert.equal((await response.json()).data[0].title, 'Admin card');
  } finally {
    UserService.getById = originalUserLookup;
    Project.findById = originalProjectLookup;
    TaskService.getAllPaginated = originalTaskList;
    server.close();
  }
});
