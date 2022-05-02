import { Context } from "../../Classes/Context/Context";
import { Image } from "../../Models/Image";
import { ImageObjects } from "../../Models/ImageObjects";

export interface getByIdAsyncParams {
  db?: Context;
  id: number;
}

export interface getByIdsAsyncParams {
  db?: Context;
  ids: number[];
}

export interface getAllAsyncParams {
  db?: Context;
}

export interface getIdsByObjectParam {
  db?: Context;
  objects: string[];
}

export interface addAsyncParams {
  db?: Context;
  image: Image;
}

export interface saveImageParams {
  db?: Context;
  imageBuffer: string;
}

export interface discoverImageObjectsParams {
  db?: Context;
  imageB64: string;
}

export interface imageRepository {
  getByIdAsync: (params: getByIdAsyncParams) => Promise<Image | null>;
  getByIdsAsync: (params: getByIdsAsyncParams) => Promise<Image[]>;
  getAllAsync: (params: getAllAsyncParams) => Promise<Image[]>;
  getIdsByObjectAsync: (params: getIdsByObjectParam) => Promise<number[]>;
  addAsync: (params: addAsyncParams) => Promise<Image | null>;
  uploadImageAsync: (params: saveImageParams) => Promise<string | null>;
  discoverImageObjectsAsync: (
    params: discoverImageObjectsParams
  ) => Promise<ImageObjects[]>;
}
