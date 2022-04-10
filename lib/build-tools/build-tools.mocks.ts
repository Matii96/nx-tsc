import { IBuildTool } from './build-tool.interface';
import { BuildTool } from './build-tool';

export class BuildToolsMock extends BuildTool implements IBuildTool {
  override async execute() {}

  override async abord() {
    this.aborted = true;
  }

  override cleanup() {}
}
