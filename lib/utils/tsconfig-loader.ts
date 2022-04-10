import { join, resolve, dirname } from 'path';
import { readFileSync } from 'fs';

export const tsconfigLoader = (filepath: string) => {
  const tsconfigDirname = dirname(filepath);
  const tsconfig = JSON.parse(readFileSync(filepath).toString());
  let outDir: string;
  let paths: Record<string, string[]> = {};

  if (tsconfig.extends) {
    const parentConfig = tsconfigLoader(resolve(tsconfigDirname, tsconfig.extends));
    outDir = parentConfig.outDir;
    paths = { ...paths, ...parentConfig.paths };
  }

  if (tsconfig?.compilerOptions) {
    if (tsconfig.compilerOptions.outDir) {
      outDir = join(tsconfigDirname, tsconfig.compilerOptions.outDir);
    }
    paths = { ...paths, ...(tsconfig.compilerOptions.paths || {}) };
  }

  return { outDir, paths };
};
