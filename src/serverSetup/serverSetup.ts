import express, { Request, Response } from "express";
// import { imageRouter } from "../routes/imageRouter/imageRouter";
import { imageRepository } from "../repositories/imageRepository/imageRepository";
import { imageHandler } from "../handlers/imageHandler";
import { param } from "express-validator";

interface serverParams {
  imageRepository: imageRepository;
}

const serverSetup = (params: serverParams) => {
  const app = express();
  app.use(express.static("public"));
  app.use(express.json());

  app.get("/", async (req: Request, res: Response) => {
    res.status(200).send("success");
  });
  app.get("/images", imageHandler.getAll(params.imageRepository));

  app.get(
    "/images/:id",
    param("id").exists().isInt({ min: 1 }),
    imageHandler.getById(params.imageRepository)
  );

  return app;
};

export { serverSetup };
