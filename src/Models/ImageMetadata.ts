export interface ImageMetadata {
  Id: number;
  ImageId: number;
  Name: string;
  Value: string;
  CreateDate: number;
  IsActive: boolean;
}

const ImageMetadataModel: ImageMetadata = {
  CreateDate: 0,
  Id: 0,
  ImageId: 0,
  IsActive: false,
  Name: "",
  Value: "",
};
export { ImageMetadataModel };
