import * as childProcess from 'child_process';
import { tscRunnerOptionsMock } from '../build-executor.mocks';
import { ProjectBuilder } from './project-builder';

describe('ProjectBuilder', () => {
  let buildTool: ProjectBuilder;

  beforeEach(() => {
    buildTool = new ProjectBuilder();
    buildTool.configure(tscRunnerOptionsMock());
    const buildProcess = new childProcess.ChildProcess();
    // @ts-ignore
    buildProcess.stdout = { on: jest.fn() };
    jest.spyOn(childProcess, 'exec').mockReturnValue(buildProcess);
  });

  describe('execute', () => {
    it('should execute project build', async () => {
      const task = buildTool.execute();
      // @ts-ignore
      buildTool.buildProcess.emit('exit', 0);

      await task;
      expect(childProcess.exec).toHaveBeenCalledTimes(1);
    });
  });
});
