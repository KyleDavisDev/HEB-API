"use strict";

import { Context } from "../../Classes/Context/Context";
import { SqlContext } from "../../Classes/Context/SqlContext";
import { FileContext } from "../../Classes/Context/FileContext";
import { Image } from "../../Models/Image";
import { ImageMetadata } from "../../Models/ImageMetadata";
import { ImageObjects } from "../../Models/ImageObjects";
import { ImageTypes } from "../../Models/ImageTypes";

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
  image: string;
}

export interface imageRepository {
  getByIdAsync: (params: getByIdAsyncParams) => Promise<Image | null>;
  getAllAsync: (params: getAllAsyncParams) => Promise<Image[]>;
  addAsync: (params: addAsyncParams) => Promise<Image | null>;
  saveImageAsync: (params: saveImageParams) => Promise<string | null>;
}
