"use strict";

import { Context } from "../../Classes/Context/Context";
import { SqlContext } from "../../Classes/Context/SqlContext";
import { Image } from "../../Models/Image";

interface getByIdAsyncParams {
  db?: Context;
  id: number;
}

export const imageRepository = {
  getByIdAsync: async (params: getByIdAsyncParams): Promise<Image | null> => {
    let { id, db } = params;
    if (id < 1) return null;
    if (!db) db = SqlContext;

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
