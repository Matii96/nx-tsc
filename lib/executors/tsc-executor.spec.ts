import { Observable, Subscriber } from 'rxjs';
import { BuildTool } from '../build-tools/build-tool';
import { BuildToolsMock } from '../build-tools/build-tools.mocks';
import { ToolAbortedExeption } from '../build-tools/tool-aborted.exeption';
import { tscRunnerOptionsMock } from '../build-executor.mocks';
import { TscRunnerOptions } from '../tsc-runner.options';
import { TscExecutor } from './tsc-executor';

class InheritedTscExecutor extends TscExecutor {
  constructor(
    protected override readonly options: TscRunnerOptions,
    protected override readonly buildTools: typeof BuildTool[]
  ) {
    super();
  }
}

describe('TscExecutor', () => {
  let tscExecutor: InheritedTscExecutor;

  beforeEach(() => {
    tscExecutor = new InheritedTscExecutor(tscRunnerOptionsMock(), [BuildToolsMock]);
    // @ts-ignore
    tscExecutor.subscriber = new Subscriber();
  });

  describe('run', () => {
    it('should run executor', () => {
      // @ts-ignore
      jest.spyOn(tscExecutor, 'handle').mockReturnValue();

      expect(tscExecutor.run()).toBeInstanceOf(Observable);
    });
  });

  describe('build', () => {
    it('should build the project', async () => {
      // @ts-ignore
      jest.spyOn(tscExecutor, 'ensureNoToolRunning').mockResolvedValueOnce(true);
      // @ts-ignore
      jest.spyOn(tscExecutor, 'runTool').mockResolvedValueOnce(undefined);

      // @ts-ignore
      await tscExecutor.build();
      // @ts-ignore
      expect(tscExecutor.ensureNoToolRunning).not.toHaveBeenCalled();
      // @ts-ignore
      expect(tscExecutor.runTool).toHaveBeenCalledTimes(1);
    });

    it('should build the project - abord current run and proceed', async () => {
      // @ts-ignore
      tscExecutor.runningTool = new BuildToolsMock();
      // @ts-ignore
      jest.spyOn(tscExecutor, 'ensureNoToolRunning').mockResolvedValueOnce(true);
      // @ts-ignore
      jest.spyOn(tscExecutor, 'runTool').mockResolvedValueOnce(undefined);

      // @ts-ignore
      await tscExecutor.build();
      // @ts-ignore
      expect(tscExecutor.ensureNoToolRunning).toHaveBeenCalledTimes(1);
      // @ts-ignore
      expect(tscExecutor.runTool).toHaveBeenCalledTimes(1);
    });

    it('should build the project - abord proceeding, aborted by newer run', async () => {
      // @ts-ignore
      tscExecutor.runningTool = new BuildToolsMock();
      // @ts-ignore
      jest.spyOn(tscExecutor, 'ensureNoToolRunning').mockResolvedValueOnce(true);
      // @ts-ignore
      jest.spyOn(tscExecutor, 'runTool').mockRejectedValueOnce(new ToolAbortedExeption());

      // @ts-ignore
      await tscExecutor.build();
      // @ts-ignore
      expect(tscExecutor.ensureNoToolRunning).toHaveBeenCalledTimes(1);
      // @ts-ignore
      expect(tscExecutor.runTool).toHaveBeenCalledTimes(1);
      // @ts-ignore
      expect(tscExecutor.runningTool).toBeNull();
    });
  });

  describe('runTool', () => {
    it('should run tool', async () => {
      // @ts-ignore
      await tscExecutor.runTool(BuildToolsMock);
      // @ts-ignore
      expect(tscExecutor.runningTool).toBeInstanceOf(BuildToolsMock);
    });
  });
});
