export interface ImageReader {
  getObjects: (image: File) => Promise<string[]>;

  getMetadata: (image: File) => Promise<void>;
}
