export interface ImageTypes {
  Id: number;
  Value: string;
  CreateDate: number;
  IsActive: boolean;
}

const ImageTypeModel: ImageTypes = {
  CreateDate: 0,
  Id: 0,
  IsActive: false,
  Value: "",
};

export { ImageTypeModel };
