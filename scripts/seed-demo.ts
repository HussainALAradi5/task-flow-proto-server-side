import 'dotenv/config';
import mongoose, { Types } from 'mongoose';
import bcrypt from 'bcrypt';
import { User } from '../src/models/user/User';
import { Team } from '../src/models/team/Team';
import { Project } from '../src/models/project/Project';
import { Milestone } from '../src/models/project/Milestone';
import { Task } from '../src/models/project/Task';
import { Comment } from '../src/models/project/Comment';
import { Event } from '../src/models/Event';

const ids = {
  user: new Types.ObjectId('6a0000000000000000000001'),
  admin: new Types.ObjectId('6a0000000000000000000007'),
  member: new Types.ObjectId('6a0000000000000000000008'),
  team: new Types.ObjectId('6a0000000000000000000002'),
  memberTeam: new Types.ObjectId('6a0000000000000000000009'),
  memberProject: new Types.ObjectId('6a000000000000000000000a'),
  project: new Types.ObjectId('6a0000000000000000000003'),
  milestone: new Types.ObjectId('6a0000000000000000000004'),
};

async function main(): Promise<void> {
  if (process.env.DEMO_SEED !== '1' || !process.env.MONGO_URI || !process.env.DEMO_SEED_PASSWORD) {
    throw new Error('Set DEMO_SEED=1, MONGO_URI, and DEMO_SEED_PASSWORD to run the demo seed.');
  }
  if (process.env.DEMO_SEED_PASSWORD.length < 12) {
    throw new Error('DEMO_SEED_PASSWORD must be at least 12 characters.');
  }

  await mongoose.connect(process.env.MONGO_URI);
  try {
    const password = await bcrypt.hash(process.env.DEMO_SEED_PASSWORD, 12);
    const demoUsers = [
      { _id: ids.user, code: 'demo-user', slug: 'demo-user', userName: 'demo_leader', email: 'demo@taskflow.local', role: 'Leader' },
      { _id: ids.admin, code: 'demo-admin', slug: 'demo-admin', userName: 'demo_admin', email: 'demo-admin@taskflow.local', role: 'Admin' },
      { _id: ids.member, code: 'demo-member', slug: 'demo-member', userName: 'demo_member', email: 'demo-member@taskflow.local', role: 'Member' },
    ];
    const users = [];
    for (const account of demoUsers) {
      users.push(await User.findOneAndUpdate(
        { email: account.email },
        { $setOnInsert: { ...account, password, isActive: true } },
        { upsert: true, new: true },
      ));
    }
    const user = users[0];
    const team = await Team.findOneAndUpdate(
      { code: 'demo-team' },
      { $setOnInsert: { _id: ids.team, code: 'demo-team', slug: 'demo-team', name: 'Product Studio', description: 'A sample team for exploring TaskFlow.', createdBy: user._id, isActive: true } },
      { upsert: true, new: true },
    );
    const memberTeam = await Team.findOneAndUpdate(
      { code: 'demo-member-team' },
      { $setOnInsert: { _id: ids.memberTeam, code: 'demo-member-team', slug: 'demo-member-team', name: 'Operations Group', description: 'A separate group for testing shared board access.', members: [users[2]._id], createdBy: users[1]._id, isActive: true } },
      { upsert: true, new: true },
    );
    await User.updateOne({ _id: users[2]._id, teamId: null }, { $set: { teamId: memberTeam._id } });
    const memberProject = await Project.findOneAndUpdate(
      { code: 'demo-member-project' },
      { $setOnInsert: { _id: ids.memberProject, code: 'demo-member-project', slug: 'operations-board-demo', title: 'Operations Board', description: 'Coordinate requests in the Operations Group.', teamId: memberTeam._id, members: [users[2]._id], createdBy: users[1]._id, isActive: true } },
      { upsert: true, new: true },
    );
    await Task.findOneAndUpdate(
      { code: 'demo-member-task' },
      { $setOnInsert: { code: 'demo-member-task', slug: 'demo-member-task', title: 'Review incoming requests', description: 'Move this card between columns as the work progresses.', status: 'To Do', priority: 'Medium', projectId: memberProject._id, createdBy: users[1]._id, isActive: true } },
      { upsert: true },
    );
    const project = await Project.findOneAndUpdate(
      { code: 'demo-project' },
      { $setOnInsert: { _id: ids.project, code: 'demo-project', slug: 'website-refresh-demo', title: 'Website Refresh', description: 'Plan, design, and launch the new customer site.', teamId: team._id, members: [user._id], createdBy: user._id, isActive: true } },
      { upsert: true, new: true },
    );
    for (const extra of [
      { code: 'demo-project-2', slug: 'customer-portal-demo', title: 'Customer Portal', description: 'Make account self-service clear and simple.' },
      { code: 'demo-project-3', slug: 'mobile-app-demo', title: 'Mobile App Pilot', description: 'Test a focused mobile experience with early users.' },
    ]) {
      await Project.findOneAndUpdate(
        { code: extra.code },
        { $setOnInsert: { ...extra, teamId: team._id, members: [user._id], createdBy: user._id, isActive: true } },
        { upsert: true },
      );
    }
    const milestone = await Milestone.findOneAndUpdate(
      { code: 'demo-milestone' },
      { $setOnInsert: { _id: ids.milestone, code: 'demo-milestone', slug: 'design-ready-demo', name: 'Design ready', projectId: project._id, createdBy: user._id, isActive: true } },
      { upsert: true, new: true },
    );
    const examples = [
      { code: 'demo-task-1', title: 'Audit current pages', status: 'Done', priority: 'Medium' },
      { code: 'demo-task-2', title: 'Draft navigation structure', status: 'In Review', priority: 'High' },
      { code: 'demo-task-3', title: 'Design landing page', status: 'In Progress', priority: 'Critical' },
      { code: 'demo-task-4', title: 'Prepare launch checklist', status: 'To Do', priority: 'Low' },
    ];
    const tasks = [];
    for (const [index, example] of examples.entries()) {
      const task = await Task.findOneAndUpdate(
        { code: example.code },
        { $setOnInsert: { ...example, slug: example.code, description: 'Sample task for the TaskFlow demo board.', projectId: project._id, milestoneId: milestone._id, createdBy: user._id, isActive: true, targetDate: new Date(Date.now() + (index + 3) * 86400000) } },
        { upsert: true, new: true },
      );
      tasks.push(task);
      if (index === 2) {
        await Comment.findOneAndUpdate(
          { code: 'demo-comment' },
          { $setOnInsert: { code: 'demo-comment', slug: 'demo-comment', content: 'Ready for the first design review.', taskId: task._id, createdBy: user._id, isActive: true } },
          { upsert: true },
        );
      }
    }
    const history = [
      { code: 'demo-event-project', title: 'Project created', description: 'New project: Website Refresh', entityType: 'Project', entityId: project._id, daysAgo: 6 },
      { code: 'demo-event-milestone', title: 'Milestone created', description: 'New milestone: Design ready', entityType: 'Milestone', entityId: milestone._id, daysAgo: 5 },
      { code: 'demo-event-task-created', title: 'Task created', description: 'New task: Design landing page', entityType: 'Task', entityId: tasks[2]._id, daysAgo: 4 },
      { code: 'demo-event-task-moved', title: 'Task moved', description: 'Moved Design landing page from To Do to In Progress', entityType: 'Task', entityId: tasks[2]._id, daysAgo: 2 },
      { code: 'demo-event-comment', title: 'Comment created', description: 'New comment on task', entityType: 'Task', entityId: tasks[2]._id, daysAgo: 1 },
    ];
    for (const item of history) {
      const { daysAgo, ...event } = item;
      await Event.findOneAndUpdate(
        { code: item.code },
        { $setOnInsert: { ...event, slug: item.code, createdBy: user._id, createdAt: new Date(Date.now() - daysAgo * 86400000) } },
        { upsert: true },
      );
    }
    console.log('Demo seed ready: demo_admin, demo_leader, demo_member (Operations Group)');
  } finally {
    await mongoose.disconnect();
  }
}

main().catch((error: Error) => {
  console.error(error.message);
  process.exitCode = 1;
});
