import { join, resolve, dirname } from 'path';
import { readFileSync } from 'fs';

export const tsconfigLoader = (filepath: string) => {
  const tsconfigDirname = dirname(filepath);
  const tsconfig = JSON.parse(readFileSync(filepath).toString());
  let outDir: string;
  let paths: Record<string, string[]> = {};
  let excludeFiles: string[] = [];
  let includeFiles: string[] = [];

  if (tsconfig.extends) {
    const parentConfig = tsconfigLoader(resolve(tsconfigDirname, tsconfig.extends));
    outDir = parentConfig.outDir;
    paths = { ...paths, ...parentConfig.paths };
    excludeFiles = [...excludeFiles, ...parentConfig.excludeFiles];
    includeFiles = [...includeFiles, ...parentConfig.includeFiles];
  }

  if (tsconfig?.compilerOptions) {
    if (tsconfig.compilerOptions.outDir) {
      outDir = join(tsconfigDirname, tsconfig.compilerOptions.outDir);
    }
    paths = { ...paths, ...(tsconfig.compilerOptions.paths || {}) };
  }

  excludeFiles = [...excludeFiles, ...(tsconfig.exclude || []).map((path: string) => join(tsconfigDirname, path))];
  includeFiles = [...includeFiles, ...(tsconfig.include || []).map((path: string) => join(tsconfigDirname, path))];

  return { outDir, paths, excludeFiles, includeFiles };
};
