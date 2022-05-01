export interface Context {
  queryAsync: (sql: string, args?: any) => Promise<any>;
  saveImageAsync: (image: string) => Promise<string | null>;
}
