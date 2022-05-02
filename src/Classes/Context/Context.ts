export interface imageObject {
  name: string;
  value: number;
}

export interface Context {
  queryAsync: (sql: string, args?: any) => Promise<any>;
  uploadImageAsync: (imageBuffer: string) => Promise<string | null>;
  getImageObjectsAsync: (imageB64: string) => Promise<imageObject[]>;
}
