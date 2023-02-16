import * as fs from 'fs';
import * as glob from 'glob';
import { tscRunnerOptionsMock } from '../../build-executor.mocks';
import { PathsResolver } from './paths-resolver';

describe('PathsResolver', () => {
  const tscRunnerOptions = tscRunnerOptionsMock();
  tscRunnerOptions.paths = {
    '@executors/tsc-builder': ['libs/tsc-builder/src/index.ts'],
    '@executors/tsc-watcher': ['libs/tsc-watcher/src/index.ts'],
  };
  tscRunnerOptions.outDir = '/app/dist';
  const compiledFile = `
    const tsc_builder_1 = require("@executors/tsc-builder");
    const tsc_builder_2 = require('@executors/tsc-builder');
    const tsc_watcher_1 = require("@executors/tsc-watcher");
  `;
  const pathToFile = tscRunnerOptions.outDir + '/server/index.js';

  let buildTool: PathsResolver;
  beforeEach(() => {
    buildTool = new PathsResolver();
    buildTool.configure(tscRunnerOptions);
  });

  describe('execute', () => {
    it('should read list of files and process them', async () => {
      jest.spyOn(glob, 'sync').mockReturnValueOnce(['file1']).mockReturnValueOnce(['file2']);
      // @ts-ignore
      jest.spyOn(buildTool, 'processFile').mockImplementation();

      await buildTool.execute();

      // @ts-ignore
      expect(buildTool.processFile).toHaveBeenCalledTimes(2);
    });
  });

  describe('processFile', () => {
    it('should process file', async () => {
      jest.spyOn(fs, 'readFileSync').mockReturnValueOnce(compiledFile);
      jest.spyOn(fs, 'writeFileSync').mockReturnValueOnce();
      // @ts-ignore
      jest.spyOn(buildTool, 'replacePaths').mockImplementation();

      // @ts-ignore
      await buildTool.processFile(pathToFile);
      // @ts-ignore
      expect(buildTool.replacePaths).toHaveBeenCalledTimes(Object.keys(tscRunnerOptions.paths).length);
    });
  });

  describe('replacePaths', () => {
    it('should replace first file path', () => {
      // @ts-ignore
      const result = buildTool.replacePaths({
        filePath: pathToFile,
        file: compiledFile,
        pathKey: '@executors/tsc-builder',
      });

      expect(result).toContain('../libs/tsc-builder/src/index.js');
      expect(result).not.toContain("require('@executors/tsc-builder')");
      expect(result).not.toContain('require("@executors/tsc-builder")');
    });

    it('should replace second file path', () => {
      // @ts-ignore
      const result = buildTool.replacePaths({
        filePath: pathToFile,
        file: compiledFile,
        pathKey: '@executors/tsc-watcher',
      });

      expect(result).toContain('../libs/tsc-watcher/src/index.js');
      expect(result).not.toContain('require("@executors/tsc-watcher")');
    });
  });
});
