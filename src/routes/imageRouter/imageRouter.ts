import express, { NextFunction, Request, Response } from "express";
import { param, validationResult } from "express-validator";
import { Image } from "../../Models/Image";
import { imageRepository } from "../../repositories/imageRepository/imageRepository";

const router = express.Router();

/** @route GET /images
 *  @description Grab metadata about all available images
 *  @return JSON of image metadata
 */
router.get("/", async (req: Request, res: Response) => {
  return res.status(200).send("you did it!");
  const images: Image[] = await imageRepository.getAllAsync({});

  return res.status(200).send(images);
});

/** @route GET /images/:id
 *  @description Grab metadata about a specific image
 *  @param {String} req.body.id - unique id of the image
 *  @return JSON of image metadata for the specified image
 */
router.get(
  "/:id",
  param("id").exists().isInt({ min: 1 }),
  async (req: Request, res: Response) => {
    if (!validationResult(req).isEmpty()) {
      res.status(301).end();
      return;
    }

    const { id } = req.params;
    const imageId: number = parseInt(id, 10);

    const image = await imageRepository.getByIdAsync({ id: imageId });
    console.log(image);

    return res.send("good job" + id);
  }
);

// const imageRouter = router;
export { router as imageRouter };
