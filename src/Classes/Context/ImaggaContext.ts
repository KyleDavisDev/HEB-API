require("dotenv").config({ path: "variables.env" });
import axios from "axios";

import { Context, imageObject } from "./Context";

class ImaggaContext implements Context {
  private static _instance: ImaggaContext;

  private constructor() {}

  static getInstance = (): ImaggaContext => {
    if (this._instance) {
      return this._instance;
    }

    this._instance = new ImaggaContext();
    return this._instance;
  };

  queryAsync = async (imageB64: string, args: string): Promise<any> => {};

  uploadImageAsync = async (imageBuffer: string): Promise<string | null> => {
    return Promise.resolve(null);
  };

  discoverImageObjectsAsync = async (
    imageB64: string
  ): Promise<imageObject[]> => {
    const imageObjects: imageObject[] = [];

    try {
      const authorization = `Basic ${process.env.IMAGGA_AUTHORIZATION}`;
      const responseUpload = await axios.post(
        "https://api.imagga.com/v2/uploads",
        { image_base64: imageB64 },
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: authorization,
          },
        }
      );

      const uploadID = responseUpload.data.result.upload_id;

      const responseTags = await axios.get(
        `https://api.imagga.com/v2/tags/?image_upload_id=${uploadID}`,
        {
          headers: {
            Authorization: authorization,
          },
        }
      );

      responseTags.data.result.tags.forEach((tag: any) => {
        const imageObj: imageObject = {
          name: tag.tag.en,
          value: tag.confidence,
        };
        imageObjects.push(imageObj);
      });
    } catch (error: any) {
      return imageObjects;
    }

    return imageObjects;
  };
}

const temp = ImaggaContext.getInstance();
export { temp as ImaggaContext };
