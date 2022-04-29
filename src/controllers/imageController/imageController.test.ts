import { createMock } from "ts-auto-mock";
import { imageRepository } from "./imageController";
import { Context } from "../../Classes/Context/Context";
import { Image } from "../../Models/Image";
import { ImageTypes } from "../../Models/ImageTypes";
import { ImageMetadata } from "../../Models/ImageMetadata";
import { ImageObjects } from "../../Models/ImageObjects";

describe("ImageRepository", () => {
  describe("getByIdAsync", () => {
    it("should return null on invalid id", async () => {
      // Given
      const db: Context = createMock<Context>();
      const sut = imageRepository;
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
      const sut = imageRepository;
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
      const moqType = createMock<ImageTypes>();
      const moqImageObjects = createMock<ImageObjects>();
      const moqImage = createMock<Image>();
      moqImage.Metadata = [moqMetadata];
      moqImage.Objects = [moqImageObjects];
      const db: Context = createMock<Context>({
        queryAsync: () =>
          Promise.resolve([
            { ...moqImage, ...moqType },
            [moqMetadata],
            [moqImageObjects],
          ]),
      });
      const sut = imageRepository;
      const id = 1;

      // When
      const result = await sut.getByIdAsync({ db, id });

      // Then
      expect(result).toStrictEqual(moqImage);
    });
  });

  describe("getAll", () => {
    it("should return empty set when no images are found", async () => {
      // Given
      const db: Context = createMock<Context>();
      const sut = imageRepository;

      // When
      const images = await imageRepository.getAllAsync({ db });

      // Then
      expect(images).toEqual([]);
    });
  });
});
