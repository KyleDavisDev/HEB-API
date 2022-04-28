import { ImageTypes } from "./ImageTypes";
import { ImageObjects } from "./ImageObjects";

export interface Image {
  Id: number;
  Label: string;
  Path: string;
  Type: ImageTypes;
  CreateDate: bigint;
  IsActive: boolean;

  Attributes: ImageTypes[];
  Objects: ImageObjects[];
}
