"use strict";

import { Context } from "../../Classes/Context/Context";
import { Image } from "../../Models/Image";

export const imageRepository = {
  getByIdAsync: async ({ db, id }: { db: Context; id: number }) => {
    if (id < 1) return null;

    const query = `SELECT * FROM Images
                   JOIN ImageTypes ON Images.Types = ImageTypes.Id
                   WHERE Images.Id = ? AND Images.IsActive = 1 AND ImageTypes.IsActive = 1;
                   SELECT * FROM ImageMetadata WHERE ImageId = ? AND IsActive = 1;
                   SELECT * FROM ImageObjects WHERE ImageId = ? AND IsActive = 1;`;

    const result = await db.queryAsync(query, [id]);
    if (!result) return null;

    return null;
  },
};
