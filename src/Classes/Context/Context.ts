import { ImageObjects } from "../../Models/ImageObjects";

export interface Context {
  queryAsync: (sql: string, args?: any) => Promise<any>;
  uploadImageAsync: (imageBuffer: string) => Promise<string | null>;
  getImageObjectsAsync: (imageB64: string) => Promise<ImageObjects[]>;
}
