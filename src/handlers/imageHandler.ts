import { Request, Response } from "express";
import { Image } from "../Models/Image";
import { imageRepository } from "../repositories/imageRepository/imageRepository";
import { validationResult } from "express-validator";
import axios from "axios";

const imageHandler = {
  getAll: (imageRepo: imageRepository) => {
    return async (req: Request, res: Response) => {
      const images: Image[] = await imageRepo.getAllAsync({});

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
        return res.status(301).send({ msg: `No image found for ${id}` });
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

      const path = await imageRepo.saveImageAsync({ image: imageB64 });

      // const saveImage = await imageRepo.addAsync({ image });

      return res.status(200).send(image);
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

    return imageB64;
  },
};

export { imageHandler };
