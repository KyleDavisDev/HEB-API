import { ImageTypeModel, ImageTypes } from "./ImageTypes";
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

const ImageModel: Image = {
  CreateDate: 0,
  Id: 0,
  IsActive: false,
  Label: "",
  Metadata: [],
  Objects: [],
  Path: "",
  Type: ImageTypeModel,
};

export { ImageModel };
