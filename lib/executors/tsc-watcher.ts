import { Subject, debounce, timer } from 'rxjs';
import { watch, FSWatcher } from 'chokidar';
import { TscRunnerOptions } from '../tsc-runner.options';
import { BuildTool } from '../build-tools/build-tool';
import { TscExecutor } from './tsc-executor';

export class TscWatcher extends TscExecutor {
  private watcher: FSWatcher;
  private changeObserver: Subject<void>;

  constructor(
    protected override readonly options: TscRunnerOptions,
    protected override readonly buildTools: typeof BuildTool[]
  ) {
    super();
    this.changeObserver = new Subject();
    this.changeObserver.pipe(debounce(() => timer(this.options.debounceTime))).subscribe(this.watchBuild.bind(this));
  }

  protected override handle() {
    this.watcher = watch([`${this.options.root}/apps/${this.options.projectName}`, `${this.options.root}/libs`], {
      persistent: true,
      ignoreInitial: true,
    });
    this.watcher.on('all', () => this.changeObserver.next());
    return this.build();
  }

  private watchBuild() {
    console.info('\x1b[33m%s\x1b[0m', `\n[nx-tsc] Restarting ${this.options.projectName}...`);
    return this.build();
  }
}
