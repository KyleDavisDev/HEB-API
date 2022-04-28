import express, { Request, Response } from "express";
require("dotenv").config({ path: "variables.env" });
import { imageRouter } from "../routes/imageRouter/imageRouter";

const server = express();
server.use(express.static("public"));
server.use(express.json());

server.get("/", async (req: Request, res: Response) => {
  res.status(200).send("success");
});

server.use("/images", imageRouter);

// grab port from .env file or assign default
const port: number = parseInt(<string>process.env.DEFAULT_PORT, 10) || 8080;
server.listen(port);
