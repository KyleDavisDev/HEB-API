require("dotenv").config({ path: "variables.env" });
import { Context, imageObject } from "./Context";
import { v2 as cloudinary } from "cloudinary"; // image hosting

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

class CloudinaryContext implements Context {
  private static _instance: CloudinaryContext;

  private constructor() {}

  static getInstance = (): CloudinaryContext => {
    if (this._instance) {
      return this._instance;
    }

    this._instance = new CloudinaryContext();
    return this._instance;
  };

  queryAsync(sql: string, args: string): Promise<any> {
    return Promise.resolve(undefined);
  }

  uploadImageAsync = async (imageBuffer: string): Promise<string | null> => {
    // Upload image
    const img = await cloudinary.uploader.upload(imageBuffer, {
      folder: process.env.CLOUDINARY_FOLDER,
      quality: "auto",
      fetch_format: "auto",
    });

    return Promise.resolve(img.secure_url);
  };

  discoverImageObjectsAsync(imageB64: string): Promise<imageObject[]> {
    return Promise.resolve([]);
  }
}

const temp = CloudinaryContext.getInstance();
export { temp as CloudinaryContext };
