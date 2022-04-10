import { join, resolve } from 'path';
import { throwError, map, catchError } from 'rxjs';
import { eachValueFrom } from 'rxjs-for-await';
import { ExecutorContext } from '@nrwl/devkit';
import { PathsResolver } from './build-tools/paths-resolver/paths-resolver';
import { ProjectBuilder } from './build-tools/project-builder';
import { ProjectCleaner } from './build-tools/project-cleaner';
import { TscBuildExecutorOptions } from './build-executor.options';
import { tsconfigLoader } from './utils/tsconfig-loader';
import { TscBuilder } from './executors/tsc-builder';
import { TscWatcher } from './executors/tsc-watcher';
import { BuildTool } from './build-tools/build-tool';

export default async function* handler(options: TscBuildExecutorOptions, context: ExecutorContext) {
  const tsConfigPath = join(context.root, options.tsConfig);
  const tsconfig = tsconfigLoader(tsConfigPath);

  const tscExecutor = options.watch ? TscWatcher : TscBuilder;
  const buildTools: typeof BuildTool[] = [ProjectCleaner, ProjectBuilder, PathsResolver];
  const tsc = new tscExecutor(
    {
      root: context.root,
      projectName: context.projectName,
      tsConfigPath,
      ...tsconfig,
      debounceTime: options.debounceTime,
      isVerbose: context.isVerbose,
    },
    buildTools
  );

  const outfile = resolve(context.root, tsconfig.outDir, options.main.replace(/\.ts$/, ''));

  return yield* eachValueFrom(
    tsc.run().pipe(
      catchError((err) => {
        if (context.isVerbose)
          console.error('\x1b[31m%s\x1b[0m', `[nx-tsc] Project ${context.projectName} failed to compile`);
        return throwError(() => err);
      }),
      map(() => {
        if (context.isVerbose) console.info('\x1b[32m%s\x1b[0m', `[nx-tsc] Project ${context.projectName} compiled`);
        return { success: true, outfile };
      })
    )
  );
}
