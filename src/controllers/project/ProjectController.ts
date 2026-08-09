import { BaseController } from "../BaseController";
import { IProject } from "../../interface/project/Project";
import { ProjectService } from "../../services/project/ProjectService";

class ProjectControllerClass extends BaseController<IProject> {
  constructor() {
    super(ProjectService);
  }
}

export const ProjectController = new ProjectControllerClass();
