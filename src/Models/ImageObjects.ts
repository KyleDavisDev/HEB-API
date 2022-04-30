export interface ImageObjects {
  Id: number;
  ImageId: number;
  Name: string;
  Confidence: number;
  CreateDate: number;
  IsActive: boolean;
}

const ImageObjectModel: ImageObjects = {
  Confidence: 0,
  CreateDate: 0,
  Id: 0,
  IsActive: false,
  Name: "",
  ImageId: 0,
};

export { ImageObjectModel };
