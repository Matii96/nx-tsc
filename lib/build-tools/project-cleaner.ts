import { rmSync, existsSync } from 'fs';
import { IBuildTool } from './build-tool.interface';
import { BuildTool } from './build-tool';

export class ProjectCleaner extends BuildTool implements IBuildTool {
  override async execute() {
    const projectDir = `${this.options.outDir}/apps/${this.options.projectName}`;
    if (existsSync(projectDir)) {
      rmSync(projectDir, { recursive: true });
    }
  }

  override async abort() {
    await super.abort();
  }

  override cleanup() {}
}
