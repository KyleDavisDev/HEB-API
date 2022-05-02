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
        return res.status(301).send({
          msg: `Invalid objects format. Objects must be a string and values separated by a comma. Ex: 'dog' or 'dog,cat'.`,
        });
      }

      // Grab from query
      const { objects: queryObjects } = req.query;
      let images: Image[] = [];

      // Utilize objects query if available otherwise skip
      if (queryObjects && typeof queryObjects === "string") {
        // do a  bit of massaging to get in right format
        const objects = queryObjects.replace(/"/g, "").split(",");

        // grab the images Ids that contain that object
        const ids = await imageRepo.getIdsByObjectAsync({
          objects: objects,
        });
        if (ids.length === 0) {
          return res.status(301).send({
            msg: `.No images found with requested categories of '${objects}'`,
          });
        }

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
        return res
          .status(301)
          .send({ msg: `Invalid Id format. Id must be a number.` });
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
      try {
        if (!validationResult(req).isEmpty()) {
          return res.status(301).send({
            msg: `Invalid JSON format. Image must be a URL or base64 encoded. Label, if provided, must be a string. Note: Base64 images must start with 'data:image/___;base64,'.`,
          });
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
        const objects = await imageRepo.discoverImageObjectsAsync({
          imageB64,
        });
        if (objects.length === 0) {
          return res.status(400).send({
            msg: "Unable to determine the objects inside of the image. This may be the result of a service being out offline or a file type of web.",
          });
        }

        // 3) save image return the path
        const path = await imageRepo.uploadImageAsync({
          imageBuffer: imageB64,
        });
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
        imageObj.Label = label ?? "Default Label";

        const savedImage: Image | null = await imageRepo.addAsync({
          image: imageObj,
        });

        return res.status(200).send(savedImage);
      } catch (e: any) {
        return res.status(400).send({ msg: "Error: " + e.message });
      }
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
    try {
      // Quick sanity check -- sharp package expects param in very specific fashion
      if (imageB64.includes(";base64,")) {
        const startIndex = imageB64.indexOf(";base64,") + ";base64,".length;
        imageB64 = imageB64.substring(startIndex);
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

      return imageMetadata;
    } catch (e) {
      throw new Error(
        "Only image types of JPEG, PNG, WebP, GIF, AVIF or TIFF are supported."
      );
    }
  },
};

export { imageHandler };
