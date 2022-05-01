import { Image } from "../../Models/Image";
import { SqlContext } from "../../Classes/Context/SqlContext";
import { ImageMetadata } from "../../Models/ImageMetadata";
import { ImageObjects } from "../../Models/ImageObjects";
import { ImageTypes } from "../../Models/ImageTypes";
import { CloudinaryContext } from "../../Classes/Context/CloudinaryContext";
import {
  addAsyncParams,
  getAllAsyncParams,
  getByIdAsyncParams,
  imageRepository,
  saveImageParams,
} from "./imageRepository";

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

  addAsync: async (params: addAsyncParams): Promise<Image | null> => {
    let { image, db } = params;
    if (!db) db = SqlContext; // default context

    const query = `INSERT INTO 'Images'('TypeId', 'Label', 'Path', 'CreateDate', 'IsActive')
                   VALUES ((SELECT TOP 1 Id FROM ImageTypes WHERE Value = ? AND IsActive = 1), ?, ?, now(), true);`;

    const results = await db.queryAsync(query, [
      image.Type.Value,
      image.Label,
      image.Path,
    ]);
    if (!results) return Promise.resolve(null);

    return Promise.resolve(image);
  },

  saveImageAsync: async (params: saveImageParams): Promise<string | null> => {
    let { imageB64, db } = params;
    if (!db) db = CloudinaryContext; // default context

    const path = await db.saveImageAsync(imageB64);
    if (!path) return Promise.resolve(null);

    return Promise.resolve(path);
  },
};

export { imageRepositoryImpl };
