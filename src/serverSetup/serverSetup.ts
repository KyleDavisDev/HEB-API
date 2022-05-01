import express, { Request, Response } from "express";
import { imageRouter } from "../routes/imageRouter/imageRouter";
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

  app.use("/images", imageRouter(params.imageRepository));

  return app;
};

export { serverSetup };
