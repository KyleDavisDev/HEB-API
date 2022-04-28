export interface Context {
  queryAsync: (sql: string, args: any) => Promise<any>;
}
