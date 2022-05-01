import * as Buffer from "buffer";

export interface Context {
  queryAsync: (sql: string, args?: any) => Promise<any>;
  uploadImageAsync: (imageBuffer: string) => Promise<string | null>;
}
