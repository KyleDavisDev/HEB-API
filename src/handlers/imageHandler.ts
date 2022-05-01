import { Request, Response } from "express";
import { Image } from "../Models/Image";
import { imageRepository } from "../repositories/imageRepository/imageRepository";
import { validationResult } from "express-validator";

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
};

export { imageHandler };
