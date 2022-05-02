import { Context } from "../../Classes/Context/Context";
import { Image } from "../../Models/Image";
import { ImageObjects } from "../../Models/ImageObjects";

export interface getByIdAsyncParams {
  db?: Context;
  id: number;
}

export interface getAllAsyncParams {
  db?: Context;
}

export interface addAsyncParams {
  db?: Context;
  image: Image;
}

export interface saveImageParams {
  db?: Context;
  imageBuffer: string;
}

export interface getImageObjectsParams {
  db?: Context;
  imageB64: string;
}

export interface imageRepository {
  getByIdAsync: (params: getByIdAsyncParams) => Promise<Image | null>;
  getAllAsync: (params: getAllAsyncParams) => Promise<Image[]>;
  addAsync: (params: addAsyncParams) => Promise<Image | null>;
  uploadImageAsync: (params: saveImageParams) => Promise<string | null>;
  getImageObjects: (params: getImageObjectsParams) => Promise<ImageObjects[]>;
}
