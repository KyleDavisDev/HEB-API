import express, { NextFunction, Request, Response } from "express";
import { param, validationResult } from "express-validator";

const router = express.Router();

/** @route GET /images
 *  @description Grab metadata about all available images
 *  @return JSON of image metadata
 */
router.get("/", async (req: Request, res: Response) => {
  res.status(200).send("success!");
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
    const imageId = parseInt(id, 10);
    console.log(imageId);

    res.send("good job" + id);
  }
);

// const imageRouter = router;
export { router as imageRouter };
