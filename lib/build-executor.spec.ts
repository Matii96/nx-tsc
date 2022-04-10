import { resolve } from 'path';
import { Observable } from 'rxjs';
import * as tsconfigLoader from './utils/tsconfig-loader';
import * as tscBuilder from './executors/tsc-builder';
import * as tscWatcher from './executors/tsc-watcher';
import { handlerContextMock, handlerOptionsMock } from './build-executor.mocks';
import handler from './build-executor';

describe('BuildExecutor', () => {
  beforeAll(() => {
    jest
      .spyOn(tsconfigLoader, 'tsconfigLoader')
      .mockReturnValue({ outDir: './dist', paths: { '@mock-workspace/common': ['libs/common/src/index.ts'] } });
    // @ts-ignore
    jest.spyOn(tscBuilder, 'TscBuilder').mockReturnValue({
      run: () =>
        new Observable((subscriber) => {
          subscriber.next();
          subscriber.complete();
        }),
    });
    // @ts-ignore
    jest.spyOn(tscWatcher, 'TscWatcher').mockReturnValue({
      run: () =>
        new Observable((subscriber) => {
          [1, 2, 3, 4].forEach(() => subscriber.next());
          subscriber.complete();
        }),
    });
  });

  describe('handler', () => {
    it('should generate one result', async () => {
      const handlerContext = handlerContextMock();
      const generator = handler(handlerOptionsMock(), handlerContext);

      let result = await generator.next();
      expect(result.value).toEqual({
        success: true,
        outfile: resolve(handlerContext.root, 'dist/apps/server/src/main'),
      });

      result = await generator.next();
      expect(result.done).toBe(true);
    });

    it('should generate 4 results', async () => {
      const handlerOptions = { ...handlerOptionsMock(), watch: true };
      const handlerContext = handlerContextMock();
      const generator = handler(handlerOptions, handlerContext);

      for (let i = 0; i < 4; i++) {
        const result = await generator.next();
        expect(result.done).toBe(false);
        expect(result.value).toEqual({
          success: true,
          outfile: resolve(handlerContext.root, 'dist/apps/server/src/main'),
        });
      }

      const result = await generator.next();
      expect(result.done).toBe(true);
    });
  });
});
