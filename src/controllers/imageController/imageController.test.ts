import { createMock } from "ts-auto-mock";
import { imageRepository } from "./imageController";
import { Context } from "../../Classes/Context/Context";

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

    it("should returns null on unfound image", async () => {
      // Given
      const db: Context = createMock<Context>();
      const sut = imageRepository;
      const id = 1;

      // When
      const result = await sut.getByIdAsync({ db, id });

      // Then
      expect(result).toBeNull();
    });
  });
});
