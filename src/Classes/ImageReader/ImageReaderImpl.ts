import { ImageReader } from "./ImageReader";

class ImageReaderImpl implements ImageReader {
  getMetadata = (image: File): Promise<void> => {
    return Promise.resolve(undefined);
  };

  getObjects = (image: File): Promise<string[]> => {
    return Promise.resolve([]);
  };
}

export { ImageReaderImpl };
