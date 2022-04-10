import { Subscriber } from 'rxjs';
import { BuildToolsMock } from '../build-tools/build-tools.mocks';
import { tscRunnerOptionsMock } from '../build-executor.mocks';
import { TscBuilder } from './tsc-builder';

describe('TscBuilder', () => {
  let tscExecutor: TscBuilder;

  beforeEach(() => {
    tscExecutor = new TscBuilder(tscRunnerOptionsMock(), [BuildToolsMock]);
    // @ts-ignore
    tscExecutor.subscriber = new Subscriber();
  });

  describe('handle', () => {
    it('should handle execution', async () => {
      // @ts-ignore
      jest.spyOn(tscExecutor, 'build').mockResolvedValueOnce();

      // @ts-ignore
      await tscExecutor.handle();
      // @ts-ignore
      expect(tscExecutor.build).toHaveBeenCalledTimes(1);
    });
  });
});
