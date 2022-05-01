require("dotenv").config({ path: "variables.env" });
import { Context } from "./Context";
import { v2 as cloudinary } from "cloudinary"; // image hosting

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

class FileContext implements Context {
  private static _instance: FileContext;

  private constructor() {}

  static getInstance = (): FileContext => {
    if (this._instance) {
      return this._instance;
    }

    this._instance = new FileContext();
    return this._instance;
  };

  queryAsync(sql: string, args: string): Promise<any> {
    return Promise.resolve(undefined);
  }

  saveImageAsync = async (image: string): Promise<string | null> => {
    console.log("I MADE IT TO THE REPO");

    // Upload image
    const img = await cloudinary.uploader.upload(image, {
      folder: process.env.CLOUDINARY_FOLDER,
      quality: "auto",
      fetch_format: "auto",
    });

    console.log(img);

    return Promise.resolve(null);
  };
}

const temp = FileContext.getInstance();
export { temp as FileContext };
