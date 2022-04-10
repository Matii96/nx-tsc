export interface TscRunnerOptions {
  root: string;
  projectName: string;
  tsConfigPath: string;
  outDir: string;
  paths: Record<string, string[]>;
  debounceTime: number;
  isVerbose: boolean;
}
