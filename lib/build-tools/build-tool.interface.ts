import { TscRunnerOptions } from '../tsc-runner.options';

export interface IBuildTool {
  /**
   * Setup tool
   * @param {TscRunnerOptions} options
   */
  configure(options: TscRunnerOptions): void;

  /**
   * Run tool action. Needs to be configured first
   */
  execute(): Promise<void>;

  /**
   * Interrupt tool's execution
   */
  abord(): Promise<void>;

  isAborted(): boolean;

  /**
   * Run post-execute actions
   */
  cleanup(): void;
}
