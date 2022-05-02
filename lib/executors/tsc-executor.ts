import { Observable, Subscriber } from 'rxjs';
import { ToolAbortedExeption } from '../build-tools/tool-aborted.exeption';
import { TscRunnerOptions } from '../tsc-runner.options';
import { IBuildTool } from '../build-tools/build-tool.interface';
import { BuildTool } from '../build-tools/build-tool';

export abstract class TscExecutor {
  protected readonly options: TscRunnerOptions;
  protected readonly buildTools: typeof BuildTool[];
  protected runningTool: IBuildTool;
  protected subscriber: Subscriber<void>;

  run() {
    return new Observable((subscriber) => {
      this.subscriber = subscriber;
      this.handle();
    });
  }

  protected handle() {
    throw new Error('Method not implemented.');
  }

  protected async build() {
    try {
      if (this.runningTool) {
        // It seems that step is already being aborted by another build run
        if (this.runningTool.isAborted()) return;

        await this.ensureNoToolRunning();
      }

      for (const tool of this.buildTools) {
        await this.runTool(tool);
      }
      this.runningTool = null;
      this.subscriber.next();
    } catch (err) {
      this.runningTool.cleanup();
      this.runningTool = null;
      if (err instanceof ToolAbortedExeption) {
        return;
      }

      this.handleBuildException(err);
    }
  }

  protected handleBuildException(err: Error) {
    this.subscriber.error(err);
  }

  private ensureNoToolRunning() {
    if (this.options.isVerbose) {
      console.info('\x1b[33m%s\x1b[0m', `[nx-tsc] Abording ${this.runningTool.constructor.name}...`);
    }
    return this.runningTool.abord();
  }

  private async runTool(tool: typeof BuildTool) {
    if (this.options.isVerbose) {
      console.info('\x1b[33m%s\x1b[0m', `[nx-tsc] Running ${tool.name}...`);
    }

    this.runningTool = new tool();
    this.runningTool.configure(this.options);
    await this.runningTool.execute();
    this.runningTool.cleanup();
  }
}
