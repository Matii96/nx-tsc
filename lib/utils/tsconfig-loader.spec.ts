import * as path from 'path';
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
          exclude: ['exclude/files'],
          include: ['include/files'],
        })
      )
      .mockReturnValueOnce(
        JSON.stringify({
          compilerOptions: { paths: { path2: ['path2res'] } },
          exclude: ['exclude/files-2'],
        })
      );
    jest.spyOn(path, 'resolve').mockReturnValueOnce('path/to/tsconfig.base.json');

    const config = tsconfigLoader('path/to/tsconfig.json');
    expect(config.outDir).toEqual(path.join('path/to', 'dist'));
    expect(config.paths).toMatchObject({
      path1: ['path1res'],
      path2: ['path2res'],
    });
    expect(config.excludeFiles).toEqual(
      ['exclude/files-2', 'exclude/files'].map((filepath) => path.join('path/to', filepath))
    );
  });
});
