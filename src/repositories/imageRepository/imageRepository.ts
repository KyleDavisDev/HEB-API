"use strict";

import { Context } from "../../Classes/Context/Context";
import { SqlContext } from "../../Classes/Context/SqlContext";
import { Image } from "../../Models/Image";
import { ImageMetadata } from "../../Models/ImageMetadata";
import { ImageObjects } from "../../Models/ImageObjects";
import { ImageTypes } from "../../Models/ImageTypes";

export interface getByIdAsyncParams {
  db?: Context;
  id: number;
}

export interface getAllAsyncParams {
  db?: Context;
}

export interface imageRepository {
  getByIdAsync: (params: getByIdAsyncParams) => Promise<Image | null>;
  getAllAsync: (params: getAllAsyncParams) => Promise<Image[]>;
}

const imageRepositoryImpl: imageRepository = {
  getByIdAsync: async (params: getByIdAsyncParams): Promise<Image | null> => {
    let { id, db } = params;
    if (id < 1) return null;
    if (!db) db = SqlContext; // default context

    const query = `SELECT Images.Id as 'Images.Id', Images.TypeId as 'Images.TypeId', Images.Label as 'Images.Label',
                        Images.Path as 'Images.Path', Images.CreateDate as 'Images.CreateDate', Images.IsActive as 'Images.IsActive',
                        ImageTypes.Id as 'ImageTypes.Id', ImageTypes.Value as 'ImageTypes.Value',
                        ImageTypes.CreateDate as 'ImageTypes.CreateDate', ImageTypes.IsActive as 'ImageTypes.IsActive'
                   FROM Images
                   JOIN ImageTypes ON Images.TypeID = ImageTypes.Id
                   WHERE Images.Id = ? AND Images.IsActive = 1 AND ImageTypes.IsActive = 1;
                   SELECT Id, ImageId, Name, Value,	CreateDate,	IsActive  FROM ImageMetadata WHERE ImageId = ? AND IsActive = 1;
                   SELECT Id, ImageId, Name, Confidence, CreateDate, IsActive FROM ImageObjects WHERE ImageId = ? AND IsActive = 1;`;

    const results = await db.queryAsync(query, [id, id, id]).catch((x) => x);
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
      CreateDate: results[0]["ImageTypes.CreateDate"],
      Id: results[0]["ImageTypes.Id"],
      IsActive: results[0]["ImageTypes.IsActive"],
      Value: results[0]["ImageTypes.Value"],
    };

    const image: Image = {
      CreateDate: results[0]["Images.CreateDate"],
      Id: results[0]["Images.Id"],
      IsActive: results[0]["Images.IsActive"],
      Label: results[0]["Images.Label"],
      Path: results[0]["Images.Path"],
      Type: imageType,
      Metadata: metaData,
      Objects: imageObjects,
    };

    return image;
  },

  getAllAsync: async (params: getAllAsyncParams): Promise<Image[]> => {
    console.log("INside of the ALL123");
    let { db } = params;
    if (!db) db = SqlContext; // default context

    const query = `SELECT Images.Id as 'Images.Id', Images.TypeId as 'Images.TypeId', Images.Label as 'Images.Label',
                       Images.Path as 'Images.Path', Images.CreateDate as 'Images.CreateDate', Images.IsActive as 'Images.IsActive',
                       ImageTypes.Id as 'ImageTypes.Id', ImageTypes.Value as 'ImageTypes.Value',
                       ImageTypes.CreateDate as 'ImageTypes.CreateDate', ImageTypes.IsActive as 'ImageTypes.IsActive'
                   FROM Images
                   JOIN ImageTypes ON Images.TypeID = ImageTypes.Id
                   WHERE Images.IsActive = 1 AND ImageTypes.IsActive = 1;
                   SELECT Id, ImageId, Name, Value,	CreateDate,	IsActive  FROM ImageMetadata WHERE IsActive = 1;
                   SELECT Id, ImageId, Name, Confidence, CreateDate, IsActive FROM ImageObjects WHERE IsActive = 1;`;

    const results = await db.queryAsync(query);
    if (!results) return Promise.resolve([]);

    // Piecing it all together!
    // The tradeoff of having such a normalized DB is that now we have to put more effort into piecing everything together
    const metaData: { [key: number]: ImageMetadata[] } = {};
    results[1].forEach((data: ImageMetadata) => {
      const key = data.ImageId;

      // initialize array at key if we don't already have something there
      if (!metaData[key]) {
        metaData[key] = [];
      }

      metaData[key].push(data);
    });

    const imageObjects: { [key: number]: ImageObjects[] } = [];
    results[2].forEach((obj: ImageObjects) => {
      const key = obj.ImageId;

      // initialize array at key if we don't already have something there
      if (!imageObjects[key]) {
        imageObjects[key] = [];
      }

      imageObjects[key].push(obj);
    });

    const images: Image[] = [];
    results[0].forEach((row: any) => {
      const type: ImageTypes = {
        CreateDate: row["ImageTypes.CreateDate"],
        Id: row["ImageTypes.Id"],
        IsActive: row["ImageTypes.IsActive"],
        Value: row["ImageTypes.Value"],
      };

      const image: Image = {
        CreateDate: row["Images.CreateDate"],
        Id: row["Images.Id"],
        IsActive: row["Images.IsActive"],
        Label: row["Images.Label"],
        Path: row["Images.Path"],
        Type: type,
        Metadata: metaData[row["Images.Id"]],
        Objects: imageObjects[row["Images.Id"]],
      };

      images.push(image);
    });

    return Promise.resolve(images);
  },
};

export { imageRepositoryImpl };
