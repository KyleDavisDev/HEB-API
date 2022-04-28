export interface Context {
  queryAsync: (sql: string, args: string) => Promise<any>;
}
