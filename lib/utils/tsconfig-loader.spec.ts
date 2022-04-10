import { join } from 'path';
import * as fs from 'fs';
import { tsconfigLoader } from './tsconfig-loader';

describe('tsconfigLoader', () => {
  it('should load tsconfig recursively', () => {
    jest
      .spyOn(fs, 'readFileSync')
      .mockReturnValueOnce(
        JSON.stringify({
          extends: 'tsconfig.base.json',
          compilerOptions: { outDir: 'dist', paths: { path1: ['path1res'] } },
        })
      )
      .mockReturnValueOnce(
        JSON.stringify({
          compilerOptions: { paths: { path2: ['path2res'] } },
        })
      );

    const config = tsconfigLoader('path/to/tsconfig.json');
    expect(config.outDir).toEqual(join('path/to', 'dist'));
    expect(config.paths).toMatchObject({
      path1: ['path1res'],
      path2: ['path2res'],
    });
  });
});
