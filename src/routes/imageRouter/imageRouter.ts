import express, { NextFunction, Request, Response } from "express";
import { param, validationResult } from "express-validator";
import { Image } from "../../Models/Image";
import { imageRepository } from "../../repositories/imageRepository/imageRepository";
import { imageHandler } from "../../handlers/imageHandler";

const imageRouter = (imageRepo: imageRepository) => {
  const router = express.Router();

  /** @route GET /images
   *  @description Grab metadata about all available images
   *  @return JSON of image metadata
   */
  router.get("/", imageHandler.getAll(imageRepo));

  /** @route GET /images/:id
   *  @description Grab metadata about a specific image
   *  @param {String} req.body.id - unique id of the image
   *  @return JSON of image metadata for the specified image
   */
  router.get(
    "/:id",
    param("id").exists().isInt({ min: 1 }),
    imageHandler.getById(imageRepo)
  );

  return router;
};

export { imageRouter };
