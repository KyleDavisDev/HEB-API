import express, { NextFunction, Request, Response } from "express";

const router = express.Router();

//** Reminder: All routes in here prefixed with /images **//

router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  res.send("good job" + id);
});

// const imageRouter = router;
export { router as imageRouter };
