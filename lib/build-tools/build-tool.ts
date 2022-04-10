import { TscRunnerOptions } from '../tsc-runner.options';
import { IBuildTool } from './build-tool.interface';

export class BuildTool implements IBuildTool {
  protected options: TscRunnerOptions;
  protected aborted: boolean;

  configure(options: TscRunnerOptions) {
    this.options = options;
  }

  execute(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async abord(): Promise<void> {
    this.aborted = true;
  }

  isAborted() {
    return this.aborted;
  }

  cleanup(): void {
    throw new Error('Method not implemented.');
  }
}
