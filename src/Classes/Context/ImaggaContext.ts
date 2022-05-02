require("dotenv").config({ path: "variables.env" });
import axios from "axios";
import { ImageObjectModel, ImageObjects } from "../../Models/ImageObjects";

import { Context } from "./Context";

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

  getImageObjectsAsync = async (imageB64: string): Promise<ImageObjects[]> => {
    const imageObjects: ImageObjects[] = [];

    try {
      const authorization = `Basic ${process.env.IMAGGA_AUTHORIZATION}`;
      const responseUpload = await axios.post(
        "https://api.imagga.com/v2/uploads",
        { image: imageB64, image_base64: imageB64 },
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
        const imageObj = { ...ImageObjectModel };
        imageObj.Name = tag.tag.en;
        imageObj.Confidence = tag.confidence;

        imageObjects.push(imageObj);
      });
    } catch (error: any) {
      return Promise.resolve(imageObjects);
    }

    return Promise.resolve(imageObjects);
  };
}

const temp = ImaggaContext.getInstance();
export { temp as ImaggaContext };
