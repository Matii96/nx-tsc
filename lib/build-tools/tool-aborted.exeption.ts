export class ToolAbortedExeption extends Error {
  constructor() {
    super('Tool aborted');
  }
}
