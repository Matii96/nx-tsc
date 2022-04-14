import { join } from 'path';
import { Subject, debounce, timer } from 'rxjs';
import { watch, FSWatcher } from 'chokidar';
import { sync } from 'glob';
import { TscRunnerOptions } from '../tsc-runner.options';
import { BuildTool } from '../build-tools/build-tool';
import { TscExecutor } from './tsc-executor';

export class TscWatcher extends TscExecutor {
  private watcher: FSWatcher;
  private readonly changeObserver: Subject<void>;
  private readonly pathsToWatch: string[];

  constructor(
    protected override readonly options: TscRunnerOptions,
    protected override readonly buildTools: typeof BuildTool[]
  ) {
    super();
    this.changeObserver = new Subject();
    this.changeObserver.pipe(debounce(() => timer(this.options.debounceTime))).subscribe(this.watchBuild.bind(this));
    this.pathsToWatch = [...this.options.includeFiles, `${this.options.root}/libs`];
  }

  protected override handle() {
    this.watcher = watch(this.pathsToWatch, {
      persistent: true,
      ignoreInitial: true,
    });
    this.watcher.on('all', this.handleChange.bind(this));
    return this.build();
  }

  private handleChange(event: string, path: string) {
    const files = this.options.excludeFiles.flatMap((pattern) => sync(pattern)).map((filepath) => join(filepath));
    if (files.includes(join(path))) {
      return;
    }

    if (this.options.isVerbose) {
      console.info('\x1b[33m%s\x1b[0m', `\n[nx-tsc] Detected ${event} in ${path}...`);
    }
    this.changeObserver.next();
  }

  private watchBuild() {
    console.info('\x1b[33m%s\x1b[0m', `\n[nx-tsc] Restarting ${this.options.projectName}...`);
    return this.build();
  }
}
