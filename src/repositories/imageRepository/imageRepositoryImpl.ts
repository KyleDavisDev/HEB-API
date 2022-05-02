import { Image } from "../../Models/Image";
import { SqlContext } from "../../Classes/Context/SqlContext";
import { ImageMetadata } from "../../Models/ImageMetadata";
import { ImageObjectModel, ImageObjects } from "../../Models/ImageObjects";
import { ImageTypes } from "../../Models/ImageTypes";
import { CloudinaryContext } from "../../Classes/Context/CloudinaryContext";
import {
  addAsyncParams,
  getAllAsyncParams,
  getByIdAsyncParams,
  getByIdsAsyncParams,
  getIdsByObjectParam,
  discoverImageObjectsParams,
  imageRepository,
  saveImageParams,
} from "./imageRepository";
import { ImaggaContext } from "../../Classes/Context/ImaggaContext";
import { imageObject } from "../../Classes/Context/Context";

interface imageMetaSet {
  [key: number]: ImageMetadata[];
}
interface imageObjectsSet {
  [key: number]: ImageObjects[];
}
interface extraImagesParams {
  rows: any;
  imageMetas: imageMetaSet;
  imageObjects: imageObjectsSet;
}

interface imageRepositoryImpl extends imageRepository {
  extractMetadata: (rows: any) => imageMetaSet;
  extractImageObjects: (rows: any) => imageObjectsSet;
  extractImages: (params: extraImagesParams) => Image[];
}

const imageRepositoryImpl: imageRepositoryImpl = {
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
    if (!results || results[0].length === 0) return null;

    // Piecing it all together!
    const imageMetas = imageRepositoryImpl.extractMetadata(results[1]);
    const imageObjects = imageRepositoryImpl.extractImageObjects(results[2]);
    const images: Image[] = imageRepositoryImpl.extractImages({
      rows: results[0],
      imageMetas,
      imageObjects,
    });

    return images[0];
  },

  getByIdsAsync: async (params: getByIdsAsyncParams): Promise<Image[]> => {
    let { ids, db } = params;
    if (ids.length === 0) return [];
    if (!db) db = SqlContext; // default context

    const query = `SELECT Images.Id as 'Images.Id', Images.TypeId as 'Images.TypeId', Images.Label as 'Images.Label',
                        Images.Path as 'Images.Path', Images.CreateDate as 'Images.CreateDate', Images.IsActive as 'Images.IsActive',
                        ImageTypes.Id as 'ImageTypes.Id', ImageTypes.Value as 'ImageTypes.Value',
                        ImageTypes.CreateDate as 'ImageTypes.CreateDate', ImageTypes.IsActive as 'ImageTypes.IsActive'
                   FROM Images
                   JOIN ImageTypes ON Images.TypeID = ImageTypes.Id
                   WHERE Images.Id IN ? AND Images.IsActive = 1 AND ImageTypes.IsActive = 1;
                   SELECT Id, ImageId, Name, Value,	CreateDate,	IsActive  FROM ImageMetadata WHERE ImageId IN ? AND IsActive = 1;
                   SELECT Id, ImageId, Name, Confidence, CreateDate, IsActive FROM ImageObjects WHERE ImageId IN ? AND IsActive = 1;`;

    const results = await db
      .queryAsync(query, [[ids], [ids], [ids]])
      .catch((x) => x);
    if (!results || results[0].length === 0) return [];

    // Piecing it all together!
    const imageMetas = imageRepositoryImpl.extractMetadata(results[1]);
    const imageObjects = imageRepositoryImpl.extractImageObjects(results[2]);
    const images: Image[] = imageRepositoryImpl.extractImages({
      rows: results[0],
      imageMetas,
      imageObjects,
    });

    return images;
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
    const imageMetas = imageRepositoryImpl.extractMetadata(results[1]);
    const imageObjects = imageRepositoryImpl.extractImageObjects(results[2]);
    const images: Image[] = imageRepositoryImpl.extractImages({
      rows: results[0],
      imageMetas,
      imageObjects,
    });

    return images;
  },

  getIdsByObjectAsync: async (
    params: getIdsByObjectParam
  ): Promise<number[]> => {
    let { objects, db } = params;
    if (objects.length === 0) return [];
    if (!db) db = SqlContext; // default context

    const query = `SELECT DISTINCT Images.Id FROM Images
                   JOIN ImageObjects ON ImageObjects.ImageId = Images.Id
                   WHERE Images.IsActive = 1 AND ImageObjects.IsActive = 1 AND ImageObjects.Name IN ?;`;
    const results = await db.queryAsync(query, [[objects]]).catch((x) => x);
    if (!results) return [];

    const Ids = results.map((row: any) => row.Id);

    return Promise.resolve(Ids);
  },

  // insert record(s) in DB
  addAsync: async (params: addAsyncParams): Promise<Image | null> => {
    // TODO: it'd be nice to have this method use a transaction but not enough time
    let { image, db } = params;
    if (!db) db = SqlContext; // default context

    // 1) Start off with saving the image
    const insertImageQuery = `INSERT INTO Images(TypeId, Label, Path, CreateDate, IsActive)
                   VALUES ((SELECT Id FROM ImageTypes WHERE Value = ? AND IsActive = 1 LIMIT 1), ?, ?, now(), true);`;
    const args = [image.Type.Value, image.Label, image.Path];
    const insertedImageRow = await db.queryAsync(insertImageQuery, args);
    if (!insertedImageRow) return null; // get out
    image.Id = insertedImageRow.insertId;

    // 2) Then save the metadata
    let insertMetaQuery = "";
    let metaParams: any[] = [];
    image.Metadata.forEach((data) => {
      insertMetaQuery += `INSERT INTO ImageMetadata(ImageId, Name, Value, CreateDate, IsActive)
                    VALUES (?, ?, ?, now(), true);`;
      metaParams.push(...[image.Id, data.Name, data.Value]);
    });

    const insertedMetadatas = await db.queryAsync(insertMetaQuery, metaParams);
    if (!insertedMetadatas) return null; // get out

    // 3) Lastly, save the objects
    let insertObjectsQuery = "";
    let objectParams: any[] = [];
    image.Objects.forEach((data) => {
      insertObjectsQuery += `INSERT INTO ImageObjects(ImageId, Name, Confidence, CreateDate, IsActive)
                    VALUES (?, ?, ?, now(), true);`;
      objectParams.push(...[image.Id, data.Name, 15]);
    });

    const insertedObjects = await db.queryAsync(
      insertObjectsQuery,
      objectParams
    );
    if (!insertedObjects) return null;

    const savedImage = await imageRepositoryImpl.getByIdAsync({ id: image.Id });

    return savedImage;
  },

  uploadImageAsync: async (params: saveImageParams): Promise<string | null> => {
    let { imageBuffer, db } = params;
    if (!db) db = CloudinaryContext; // default context

    const path = await db.uploadImageAsync(imageBuffer);
    if (!path) return null;

    return path;
  },

  discoverImageObjectsAsync: async (
    params: discoverImageObjectsParams
  ): Promise<ImageObjects[]> => {
    let { imageB64, db } = params;
    if (!db) db = ImaggaContext; // default context

    const objectsArr: imageObject[] = await db.getImageObjectsAsync(imageB64);

    const objects = objectsArr.map((obj: imageObject) => {
      const object = { ...ImageObjectModel };
      object.Name = obj.name;
      object.Confidence = obj.value;

      return object;
    });

    return objects;
  },

  extractMetadata: (rows: any): { [key: number]: ImageMetadata[] } => {
    const result: { [key: number]: ImageMetadata[] } = {};

    rows.forEach((data: ImageMetadata) => {
      const key = data.ImageId;

      // initialize array at key if we don't already have something there
      if (!result[key]) {
        result[key] = [];
      }

      result[key].push(data);
    });

    return result;
  },

  extractImageObjects: (rows: any): { [key: number]: ImageObjects[] } => {
    const result: { [key: number]: ImageObjects[] } = {};

    rows.forEach((obj: ImageObjects) => {
      const key = obj.ImageId;

      // initialize array at key if we don't already have something there
      if (!result[key]) {
        result[key] = [];
      }

      result[key].push(obj);
    });

    return result;
  },

  extractImages: (params: extraImagesParams): Image[] => {
    const result: Image[] = [];

    const { rows, imageMetas, imageObjects } = params;

    rows.forEach((row: any) => {
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
        Metadata: imageMetas[row["Images.Id"]],
        Objects: imageObjects[row["Images.Id"]],
      };

      result.push(image);
    });

    return result;
  },
};

export { imageRepositoryImpl };
