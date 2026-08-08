import { Event } from "../models/Event";
import { Milestone } from "../models/project/Milestone";
import { Project } from "../models/project/Project";
import { Task } from "../models/project/Task";
import { Team } from "../models/team/Team";
import { User } from "../models/user/User";
import { BaseService } from "./BaseService";

export const UserService = new BaseService(User);
export const TaskService = new BaseService(Task);
export const ProjectService = new BaseService(Project);
export const TeamService = new BaseService(Team);
export const MilestoneService = new BaseService(Milestone);
export const EventService = new BaseService(Event);