import { createMock } from "ts-auto-mock";
import { Context } from "../../Classes/Context/Context";
import { ImageMetadata } from "../../Models/ImageMetadata";
import { ImageObjects } from "../../Models/ImageObjects";
import { ImageBuilder } from "../../Models/Builders/ImageBuilder";
import { ImageTypeBuilder } from "../../Models/Builders/ImageTypeBuilder";
import { Image } from "../../Models/Image";
import { ImageMetadataBuilder } from "../../Models/Builders/ImageMetadataBuilder";
import { ImageObjectBuilder } from "../../Models/Builders/ImageObjectBuilder";
import { imageRepositoryImpl } from "./imageRepositoryImpl";

describe("ImageRepository", () => {
  const _imageBuilder = new ImageBuilder();
  const _typeBuilder = new ImageTypeBuilder();
  const _metaDataBuilder = new ImageMetadataBuilder();
  const _objectBuilder = new ImageObjectBuilder();

  describe("getByIdAsync", () => {
    it("should return null on invalid id", async () => {
      // Given
      const db: Context = createMock<Context>();
      const sut = imageRepositoryImpl;
      const invalidIds = [0, -1, -5, Math.PI];

      for (let i = 0; i < invalidIds.length; i++) {
        const id = invalidIds[i];

        // When
        const result = await sut.getByIdAsync({ db, id });

        // Then
        expect(result).toBeNull();
      }
    });

    it("should return null on unfound image", async () => {
      // Given
      const db: Context = createMock<Context>();
      const sut = imageRepositoryImpl;
      const id = 1;

      // When
      const result = await sut.getByIdAsync({ db, id });

      // Then
      expect(result).toBeNull();
    });

    it("should return image when one could be found", async () => {
      // Given
      // Note: these moqs are touching a bit too close to the implementation details of
      //       how the data gets queried. I'd have to spend some more time thinking about this
      //       for larger implementations.
      const moqMetadata = createMock<ImageMetadata>();
      const moqType = _typeBuilder.AnImageFromDB();
      const moqImageObjects = createMock<ImageObjects>();
      const moqImage = _imageBuilder.AnImageFromDB();
      const db: Context = createMock<Context>({
        queryAsync: () =>
          Promise.resolve([
            [{ ...moqImage, ...moqType }],
            [moqMetadata],
            [moqImageObjects],
          ]),
      });
      const sut = imageRepositoryImpl;
      const id = 1;

      // When
      const result = await sut.getByIdAsync({ db, id });

      // Then
      // Would like to be able to match the 'shape' of Image but not seeing how to do it easily in jest
      expect(result).not.toBeNull();
      expect((result as Image).Id).not.toBeNull();
      expect((result as Image).CreateDate).not.toBeNull();
      expect((result as Image).IsActive).not.toBeNull();
      expect((result as Image).Path).not.toBeNull();
    });
  });

  describe("getByIdsAsync", () => {
    it("should return empty set on empty ids list", async () => {
      // Given
      const db: Context = createMock<Context>();
      const sut = imageRepositoryImpl;
      const ids: number[] = [];

      // When
      const result = await sut.getByIdsAsync({ db, ids });

      // Then
      expect(result).toHaveLength(0);
    });

    it("should return images that have an id within the list", async () => {
      // Given
      const fakeImages = [
        _imageBuilder.ANewImage().AnImageFromDB(),
        _imageBuilder.ANewImage().AnImageFromDB(),
      ];
      const fakeTypes = [
        _typeBuilder.AnImageFromDB(),
        _typeBuilder.AnImageFromDB(),
      ];
      const fakeMetadata = [
        _metaDataBuilder
          .Random()
          .WithImageIdOf(fakeImages[0]["Images.Id"])
          .Build(),
        _metaDataBuilder
          .Random()
          .WithImageIdOf(fakeImages[0]["Images.Id"])
          .Build(),
        _metaDataBuilder
          .Random()
          .WithImageIdOf(fakeImages[1]["Images.Id"])
          .Build(),
      ];
      const fakeObjects = [
        _objectBuilder
          .Random()
          .WithImageIdOf(fakeImages[0]["Images.Id"])
          .Build(),
        _objectBuilder
          .Random()
          .WithImageIdOf(fakeImages[1]["Images.Id"])
          .Build(),
        _objectBuilder
          .Random()
          .WithImageIdOf(fakeImages[1]["Images.Id"])
          .Build(),
      ];
      const ids: number[] = [
        fakeImages[0]["Images.Id"],
        fakeImages[1]["Images.Id"],
      ];
      const db: Context = createMock<Context>({
        queryAsync: () =>
          Promise.resolve([
            [
              { ...fakeImages[0], ...fakeTypes[0] },
              { ...fakeImages[1], ...fakeTypes[1] },
            ],
            [fakeMetadata],
            [fakeObjects],
          ]),
      });
      const sut = imageRepositoryImpl;

      // When
      const result = await sut.getByIdsAsync({ db, ids });

      // Then
      expect(result.length).toBe(2);
    });
  });

  describe("getAllAsync", () => {
    it("should return empty set when no images are found", async () => {
      // Given
      const db: Context = createMock<Context>();
      const sut = imageRepositoryImpl;

      // When
      const images = await sut.getAllAsync({ db });

      // Then
      expect(images).toEqual([]);
    });

    it("should return set of available images", async () => {
      // Given
      const fakeImage = _imageBuilder.AnImageFromDB();
      const fakeType = _typeBuilder.AnImageFromDB();
      const fakeMetadata = [
        _metaDataBuilder.Random().WithImageIdOf(fakeImage["Images.Id"]).Build(),
        _metaDataBuilder.Random().WithImageIdOf(fakeImage["Images.Id"]).Build(),
        _metaDataBuilder.Random().WithImageIdOf(fakeImage["Images.Id"]).Build(),
      ];
      const fakeObjects = [
        _objectBuilder.Random().WithImageIdOf(fakeImage["Images.Id"]).Build(),
        _objectBuilder.Random().WithImageIdOf(fakeImage["Images.Id"]).Build(),
        _objectBuilder.Random().WithImageIdOf(fakeImage["Images.Id"]).Build(),
      ];
      const db: Context = createMock<Context>({
        queryAsync: () =>
          Promise.resolve([
            [{ ...fakeImage, ...fakeType }],
            [fakeMetadata],
            [fakeObjects],
          ]),
      });
      const sut = imageRepositoryImpl;

      // When
      const images: Image[] = await sut.getAllAsync({ db });

      // Then
      // Would like to be able to match the 'shape' of Image but not seeing how to do it easily in jest
      expect(images).not.toBeNull();
      expect(images[0]).not.toBeNull();
      expect(images[0].Id).not.toBeNull();
      expect(images[0].CreateDate).not.toBeNull();
      expect(images[0].IsActive).not.toBeNull();
      expect(images[0].Path).not.toBeNull();
    });
  });

  describe("addAsync", () => {
    it("should return null if couldn't save image record", async () => {
      // Given
      const image = _imageBuilder.ANewImage().AFullRandomImage().Build();
      const db: Context = createMock<Context>({
        queryAsync: () => Promise.resolve(null),
      });
      const sut = imageRepositoryImpl;

      // When
      const result = await sut.addAsync({ db, image });

      // Then
      expect(result).toBeNull();
    });

    it("should return null if couldn't insert metadata", async () => {
      // Given
      const image = _imageBuilder.ANewImage().AFullRandomImage().Build();
      const db: Context = createMock<Context>({
        queryAsync: jest
          .fn()
          .mockReturnValueOnce(Promise.resolve({ inserted_id: 1 }))
          .mockReturnValueOnce(Promise.resolve(null)),
      });
      const sut = imageRepositoryImpl;
      // sut.getByIdAsync = () => Promise.resolve(image);

      // When
      const result = await sut.addAsync({ db, image });

      // Then
      expect(result).toBeNull();
    });

    it("should return null if couldn't insert objects", async () => {
      // Given
      const image = _imageBuilder.ANewImage().AFullRandomImage().Build();
      const db: Context = createMock<Context>({
        queryAsync: jest
          .fn()
          .mockReturnValueOnce(Promise.resolve({ inserted_id: 1 }))
          .mockReturnValueOnce(Promise.resolve(true))
          .mockReturnValueOnce(Promise.resolve(null)),
      });
      const sut = imageRepositoryImpl;
      // sut.getByIdAsync = () => Promise.resolve(image);

      // When
      const result = await sut.addAsync({ db, image });

      // Then
      expect(result).toBeNull();
    });

    it("should return full image on success", async () => {
      // Given
      const image = _imageBuilder.ANewImage().AFullRandomImage().Build();
      const db: Context = createMock<Context>({
        queryAsync: jest
          .fn()
          .mockReturnValueOnce(Promise.resolve({ inserted_id: 1 }))
          .mockReturnValueOnce(Promise.resolve(true))
          .mockReturnValueOnce(Promise.resolve(true)),
      });
      const sut = imageRepositoryImpl;
      sut.getByIdAsync = () => Promise.resolve(image);

      // When
      const result = await sut.addAsync({ db, image });

      // Then
      expect(result).toEqual(image);
    });
  });

  describe("uploadImageAsync", () => {
    it("should return false on save error", async () => {
      // Given
      const image = "";
      const db: Context = createMock<Context>({
        uploadImageAsync: () => Promise.resolve(null),
      });
      const sut = imageRepositoryImpl;

      // When
      const images = await sut.uploadImageAsync({ db, imageBuffer: image });

      // Then
      expect(images).toEqual(null);
    });

    it("should return the saved path on success", async () => {
      // Given
      const image = "";
      const path = "random_save_path";
      const db: Context = createMock<Context>({
        uploadImageAsync: () => Promise.resolve(path),
      });
      const sut = imageRepositoryImpl;

      // When
      const savedPath = await sut.uploadImageAsync({ db, imageBuffer: image });

      // Then
      expect(savedPath).toEqual(path);
    });
  });
});
