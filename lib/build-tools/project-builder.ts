import { exec, ChildProcess } from 'child_process';
import { ToolAbortedExeption } from './tool-aborted.exeption';
import { IBuildTool } from './build-tool.interface';
import { BuildTool } from './build-tool';

export class ProjectBuilder extends BuildTool implements IBuildTool {
  private buildProcess: ChildProcess;
  private resolveHandle: () => void;
  private rejectHandle: (err: Error) => void;

  override async execute() {
    this.buildProcess = exec(`tsc --build --force ${this.options.tsConfigPath}`);

    await new Promise<void>((resolve, reject) => {
      this.resolveHandle = resolve;
      this.rejectHandle = reject;
      this.buildProcess.on('exit', this.handleExit.bind(this));
      this.buildProcess.on('error', this.handleError.bind(this));
    });
  }

  override async abord() {
    await super.abord();
    try {
      this.buildProcess.kill();
      await new Promise<void>((resolve) => this.buildProcess.on('exit', () => resolve()));
    } catch {
      return;
    }
  }

  override cleanup() {
    this.buildProcess.removeAllListeners();
    this.buildProcess = null;
    this.resolveHandle = null;
    this.rejectHandle = null;
  }

  private handleExit(code: number) {
    switch (code) {
      case 0:
        this.resolveHandle();
        break;
      case 143: // SIGTERM
        this.rejectHandle(new ToolAbortedExeption());
        break;
    }
  }

  private handleError(err: Error) {
    this.rejectHandle(err);
  }
}
