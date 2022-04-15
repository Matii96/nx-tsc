import * as fs from 'fs';
import { tscRunnerOptionsMock } from '../build-executor.mocks';
import { ProjectCleaner } from './project-cleaner';

describe('ProjectCleaner', () => {
  let buildTool: ProjectCleaner;

  beforeEach(() => {
    buildTool = new ProjectCleaner();
    buildTool.configure(tscRunnerOptionsMock());
    jest.spyOn(fs, 'rmSync').mockImplementation();
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
  });

  describe('execute', () => {
    it('should clean already built project', async () => {
      await buildTool.execute();
      expect(fs.rmSync).toHaveBeenCalledTimes(1);
    });
  });
});
