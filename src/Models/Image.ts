import { ImageTypes } from "./ImageTypes";
import { ImageObjects } from "./ImageObjects";
import { ImageMetadata } from "./ImageMetadata";

export interface Image {
  Id: number;
  Label: string;
  Path: string;
  CreateDate: number;
  IsActive: boolean;

  Type: ImageTypes;
  Objects: ImageObjects[];
  Metadata: ImageMetadata[];
}
