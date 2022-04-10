export interface TscBuildExecutorOptions {
  main: string;
  tsConfig: string;
  assets: string[];
  watch: boolean;
  debounceTime: number;
}
