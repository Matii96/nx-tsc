import { ExecutorContext } from '@nrwl/devkit';
import { TscBuildExecutorOptions } from './build-executor.options';
import { TscRunnerOptions } from './tsc-runner.options';

export const handlerOptionsMock = (): TscBuildExecutorOptions => ({
  main: 'apps/server/src/main.ts',
  tsConfig: 'apps/server/tsconfig.app.json',
  assets: ['apps/server/src/assets'],
  watch: false,
  debounceTime: 0,
});

export const handlerContextMock = (): ExecutorContext => ({
  root: '/project/root',
  target: {
    executor: '@matii96/nx-tsc:build',
    outputs: ['{options.outputPath}'],
    options: {
      main: 'apps/server/src/main.ts',
      tsConfig: 'apps/server/tsconfig.app.json',
      assets: [Array],
    },
    configurations: { production: [Object] },
  },
  workspace: {
    version: 2,
    projects: { server: { root: '/project/root/server' } },
    npmScope: 'test-workspace',
    affected: { defaultBase: 'master' },
    cli: { defaultCollection: '@nrwl/nest' },
    implicitDependencies: { 'package.json': {}, '.eslintrc.json': '*' },
    defaultProject: 'server',
  },
  projectName: 'server',
  targetName: 'build',
  configurationName: undefined,
  cwd: '/project/root',
  isVerbose: false,
});

export const tscRunnerOptionsMock = (): TscRunnerOptions => {
  const handlerOptions = handlerOptionsMock();
  const handlerContext = handlerContextMock();
  return {
    root: handlerContext.root,
    projectName: handlerContext.projectName,
    tsConfigPath: handlerOptions.tsConfig,
    outDir: 'dist',
    paths: {},
    debounceTime: handlerOptions.debounceTime,
    isVerbose: false,
  };
};
