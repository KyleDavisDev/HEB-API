import express, { Request, Response } from "express";
import { body, oneOf, param, query } from "express-validator";
import { imageRepository } from "../../repositories/imageRepository/imageRepository";
import { imageHandler } from "../../handlers/imageHandler";
import * as path from "path";

const imageRouter = (imageRepo: imageRepository) => {
  const router = express.Router();

  /** @route GET /images
   *  @description Grab metadata about all available images
   *  @return JSON of image metadata
   */
  router.get(
    "",
    query("objects").optional().isString(),
    imageHandler.getAll(imageRepo)
  );

  /** @route GET /images/
   *  @description Grab metadata about all available images
   *  @return JSON of image metadata
   */
  router.get(
    "/",
    query("objects").optional().isString(),
    imageHandler.getAll(imageRepo)
  );

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

  /** @route POST /images
   *  @description submit image
   *  @param {File | string} req.body.file - file to be saved
   *  @param {string?} req.body.label - label of the image (optional)
   *  @return JSON of the saved image along with metadata and detected objects
   */
  router.post(
    "/",
    oneOf([body("image").exists().isBase64(), body("image").exists().isURL()]),
    body("label").optional().isString().isLength({ max: 150 }),
    imageHandler.saveImage(imageRepo)
  );

  return router;
};

export { imageRouter };
