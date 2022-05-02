import { Request, Response } from "express";
import axios from "axios";
import sharp from "sharp";
import { Image, ImageModel } from "../Models/Image";
import { imageRepository } from "../repositories/imageRepository/imageRepository";
import { validationResult } from "express-validator";
import { ImageMetadata, ImageMetadataModel } from "../Models/ImageMetadata";
import { ImageTypeModel } from "../Models/ImageTypes";
import { ImageObjects } from "../Models/ImageObjects";

const imageHandler = {
  getAll: (imageRepo: imageRepository) => {
    return async (req: Request, res: Response) => {
      if (!validationResult(req).isEmpty()) {
        res.status(301).end();
        return;
      }
      const { objects } = req.query;
      let images: Image[] = [];
      if (objects && typeof objects === "string") {
        // do a  bit of massaging to get in right format
        const objs = objects.replace(/"/g, "").split(",");

        // grab the images Ids that contain that object
        const ids = await imageRepo.getIdsByObject({
          objects: objs,
        });

        // turn Ids into images!
        images = await imageRepo.getByIdsAsync({ ids });
      } else {
        images = await imageRepo.getAllAsync({});
      }

      return res.status(200).send(images);
    };
  },

  getById: (imageRepo: imageRepository) => {
    return async (req: Request, res: Response) => {
      if (!validationResult(req).isEmpty()) {
        res.status(301).end();
        return;
      }

      const { id } = req.params;
      const imageId: number = parseInt(id, 10);

      const image = await imageRepo.getByIdAsync({ id: imageId });
      if (!image) {
        return res.status(301).send({ msg: `No image found for id of ${id}` });
      }

      return res.status(200).send(image);
    };
  },

  saveImage: (imageRepo: imageRepository) => {
    return async (req: Request, res: Response) => {
      if (!validationResult(req).isEmpty()) {
        res.status(301).end();
        return;
      }

      const { image, label } = req.body;

      let imageB64: string = imageHandler.isValidHttpUrl(image)
        ? await imageHandler.downloadImage(image)
        : image;

      // 1) get the metadata of the image
      const metaData = await imageHandler.getImageMetadata(imageB64);
      const typeOfImage = metaData.find((x) => x.Name === "format")?.Value;
      if (!typeOfImage) {
        return res
          .status(400)
          .send({ msg: "Unable to determine the type of image this is." });
      }

      // 2) Get the objects of the image
      const objects: ImageObjects[] = await imageRepo.getImageObjects({
        imageB64,
      });
      if (objects.length === 0) {
        return res.status(400).send({
          msg: "Unable to determine the objects inside of the image.",
        });
      }

      // 3) save image return the path
      const path = await imageRepo.uploadImageAsync({ imageBuffer: imageB64 });
      if (!path) {
        return res.status(400).send({ msg: "error saving the image" });
      }

      // construct object to save to DB!
      const imageType = { ...ImageTypeModel };
      imageType.Value = typeOfImage;

      const imageObj = { ...ImageModel };
      imageObj.Type = imageType;
      imageObj.Path = path;
      imageObj.Objects = objects;
      imageObj.Metadata = metaData;
      imageObj.Label = label;

      const savedImage: Image | null = await imageRepo.addAsync({
        image: imageObj,
      });

      return res.status(200).send(savedImage);
    };
  },

  isValidHttpUrl: (str: string): boolean => {
    let url;

    try {
      url = new URL(str);
    } catch (_) {
      return false;
    }

    return url.protocol === "http:" || url.protocol === "https:";
  },

  downloadImage: async (url: string): Promise<string> => {
    const imageBuffer = await axios.get(url, { responseType: "arraybuffer" });
    const imageB64: string = Buffer.from(imageBuffer.data).toString("base64");

    return "data:image/jpeg;base64," + imageB64;
  },

  getImageMetadata: async (imageB64: string): Promise<ImageMetadata[]> => {
    // Quick sanity check -- sharp package expects param in very specific fashion
    if (imageB64.includes("data:image/jpeg;base64,")) {
      imageB64 = imageB64.replace("data:image/jpeg;base64,", "");
    }

    const imageBuffer: Buffer = Buffer.from(imageB64, "base64");
    const metadata: sharp.Metadata = await sharp(imageBuffer).metadata();

    const imageMetadata: ImageMetadata[] = [];
    for (const [key, val] of Object.entries(metadata)) {
      if (
        typeof val === "number" ||
        typeof val === "string" ||
        typeof val === "boolean"
      ) {
        const data = { ...ImageMetadataModel };
        data.Name = key;
        data.Value = val.toString();
        imageMetadata.push(data);
      }
    }

    return Promise.resolve(imageMetadata);
  },
};

export { imageHandler };
