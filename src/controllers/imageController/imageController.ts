"use strict";

import { Context } from "../../Classes/Context/Context";
import { SqlContext } from "../../Classes/Context/SqlContext";
import { Image } from "../../Models/Image";
import { ImageMetadata } from "../../Models/ImageMetadata";
import { ImageObjects } from "../../Models/ImageObjects";
import { ImageTypes } from "../../Models/ImageTypes";

interface getByIdAsyncParams {
  db?: Context;
  id: number;
}

export const imageRepository = {
  getByIdAsync: async (params: getByIdAsyncParams): Promise<Image | null> => {
    let { id, db } = params;
    if (id < 1) return null;
    if (!db) db = SqlContext; // default context

    const query = `SELECT * FROM Images
                   JOIN ImageTypes ON Images.TypeID = ImageTypes.Id
                   WHERE Images.Id = ? AND Images.IsActive = 1 AND ImageTypes.IsActive = 1;
                   SELECT * FROM ImageMetadata WHERE ImageId = ? AND IsActive = 1;
                   SELECT * FROM ImageObjects WHERE ImageId = ? AND IsActive = 1;`;

    const results = await db.queryAsync(query, [id]).catch((x) => x);
    if (!results) return null;

    // Piecing it all together!
    const metaData: ImageMetadata[] = [];
    results[1].forEach((data: ImageMetadata) => {
      metaData.push(data);
    });

    const imageObjects: ImageObjects[] = [];
    results[2].forEach((obj: ImageObjects) => {
      imageObjects.push(obj);
    });

    const imageType: ImageTypes = {
      CreateDate: results[0].CreateDate,
      Id: results[0].Id,
      IsActive: results[0].IsActive,
      Value: results[0].Value,
    };

    const image: Image = {
      CreateDate: results[0].CreateDate,
      Id: results[0].Id,
      IsActive: results[0].IsActive,
      Label: results[0].Label,
      Path: results[0].Path,
      Type: imageType,
      Metadata: metaData,
      Objects: imageObjects,
    };

    return image;
  },
};
