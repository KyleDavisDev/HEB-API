import express, { NextFunction, Request, Response } from "express";

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
router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  const imageId = parseInt(id, 10);
  if (isNaN(imageId)) {
    res.status(301).send("oops!");
    return;
  }

  res.send("good job" + id);
});

// const imageRouter = router;
export { router as imageRouter };
