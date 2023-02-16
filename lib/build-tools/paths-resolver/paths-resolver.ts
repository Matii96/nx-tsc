import { join, dirname, relative } from 'path';
import { readFileSync, writeFileSync } from 'fs';
import { sync } from 'glob';
import { BuildTool } from '../build-tool';
import { IBuildTool } from '../build-tool.interface';
import { ToolAbortedExeption } from '../tool-aborted.exeption';
import { ReplacePathsOptions } from './paths-resolver.options';

export class PathsResolver extends BuildTool implements IBuildTool {
  override async execute() {
    let files = sync(`${this.options.outDir}/apps/${this.options.projectName}/**/*.js`);
    files = files.concat(sync(`${this.options.outDir}/libs/**/*.js`));
    for (const file of files) {
      if (this.aborted) throw new ToolAbortedExeption();
      await this.processFile(file);
    }
  }

  override abort() {
    return super.abort();
  }

  override cleanup() {}

  private async processFile(filePath: string) {
    let file = readFileSync(filePath).toString();
    for (const pathKey in this.options.paths) {
      file = this.replacePaths({ filePath, file, pathKey });
    }
    writeFileSync(filePath, file);
  }

  private replacePaths(args: ReplacePathsOptions) {
    const value = this.options.paths[args.pathKey][0].replace(/.ts$/, '.js');
    const absolutePath = join(this.options.outDir, value);
    const relativePath = relative(dirname(args.filePath), absolutePath).replace(/\\/g, '/');
    return args.file
      .replace(new RegExp(`'${args.pathKey}'`, 'g'), `'${relativePath}'`)
      .replace(new RegExp(`"${args.pathKey}"`, 'g'), `"${relativePath}"`);
  }
}
