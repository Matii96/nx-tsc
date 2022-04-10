import { TscRunnerOptions } from '../tsc-runner.options';
import { BuildTool } from '../build-tools/build-tool';
import { TscExecutor } from './tsc-executor';

export class TscBuilder extends TscExecutor {
  constructor(
    protected override readonly options: TscRunnerOptions,
    protected override readonly buildTools: typeof BuildTool[]
  ) {
    super();
  }

  protected override async handle() {
    await this.build();
    this.subscriber.complete();
  }
}
