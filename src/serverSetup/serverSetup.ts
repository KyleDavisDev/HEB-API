import express from "express";
import { imageRouter } from "../routes/imageRouter/imageRouter";
import { imageRepository } from "../repositories/imageRepository/imageRepository";

interface serverParams {
  imageRepository: imageRepository;
}

const serverSetup = (params: serverParams) => {
  const app = express();
  app.use(express.json());

  app.use("/images", imageRouter(params.imageRepository));

  return app;
};

export { serverSetup };
