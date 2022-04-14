export interface TscRunnerOptions {
  root: string;
  projectName: string;
  tsConfigPath: string;
  excludeFiles: string[];
  includeFiles: string[];
  outDir: string;
  paths: Record<string, string[]>;
  debounceTime: number;
  isVerbose: boolean;
}
