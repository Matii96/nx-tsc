import { Subscriber } from 'rxjs';
import * as chokidar from 'chokidar';
import { BuildToolsMock } from '../build-tools/build-tools.mocks';
import { tscRunnerOptionsMock } from '../build-executor.mocks';
import { TscWatcher } from './tsc-watcher';

describe('TscWatcher', () => {
  let tscExecutor: TscWatcher;
  const tscRunnerOptions = tscRunnerOptionsMock();

  beforeEach(() => {
    jest.spyOn(console, 'info').mockImplementation();

    tscExecutor = new TscWatcher(tscRunnerOptions, [BuildToolsMock]);
    // @ts-ignore
    tscExecutor.subscriber = new Subscriber();
    // @ts-ignore
    jest.spyOn(chokidar, 'watch').mockReturnValueOnce({ on: jest.fn() });
    // @ts-ignore
    jest.spyOn(tscExecutor, 'build').mockResolvedValueOnce();
  });

  describe('handle', () => {
    it('should handle execution', async () => {
      // @ts-ignore
      await tscExecutor.handle();
      // @ts-ignore
      expect(tscExecutor.build).toHaveBeenCalledTimes(1);
    });
  });

  describe('watchBuild', () => {
    it('should start build run', async () => {
      // @ts-ignore
      await tscExecutor.watchBuild();
      // @ts-ignore
      expect(tscExecutor.build).toHaveBeenCalledTimes(1);
    });
  });
});
