import { serverSetup } from "../../serverSetup/serverSetup";
import supertest, { SuperAgentTest } from "supertest";
import {
  getAllAsyncParams,
  getByIdAsyncParams,
  imageRepository,
} from "../../repositories/imageRepository/imageRepository";
import { Image } from "../../Models/Image";
import { ImageBuilder } from "../../Models/Builders/ImageBuilder";

describe("/images", () => {
  jest.setTimeout(10000); // increase timeout
  const basePath = `/`;
  const route = "images";
  let request: SuperAgentTest;
  const nullPromise = Promise.resolve(null);
  let getByIdAsyncMock: Promise<Image | null> = nullPromise;
  let addAsyncMock: Promise<Image | null> = nullPromise;
  const emptyArrPromise = Promise.resolve([]);
  let getAllAsyncMock: Promise<Image[]> = emptyArrPromise;

  beforeAll(() => {
    const imageRepositoryImpl: imageRepository = {
      getAllAsync: () => getAllAsyncMock,
      getByIdAsync: () => getByIdAsyncMock,
      addAsync: () => addAsyncMock,
    };
    const app = serverSetup({ imageRepository: imageRepositoryImpl });
    request = supertest.agent(app);
  });

  afterEach(() => {
    // reset back to default after each
    getByIdAsyncMock = nullPromise;
    addAsyncMock = nullPromise;
    getAllAsyncMock = emptyArrPromise;
  });

  describe("/", () => {
    it("should return 200 status", async () => {
      // Given
      const status = 200;

      //When
      const result = await request.get(`${basePath}`);

      //Then
      expect(result.status).toEqual(status);
    });
  });

  describe("/:id", () => {
    it("should return 301 if id is not a positive numeric value", async () => {
      //Given
      const invalidIds = [
        "a",
        "b",
        "abc",
        "test",
        ["abc", "123"],
        [1, 2, 3],
        0,
        -1,
        3.1415,
        Math.PI,
      ];
      const status = 301;

      for (let i = 0; i < invalidIds.length; i++) {
        const id = invalidIds[i];

        //When
        const result = await request.get(`${basePath}${route}/${id}`);

        //Then
        expect(result.status).toEqual(status);
      }
    });

    it("should return status of 301 on no image found", async () => {
      const id = 5;
      const status = 301;

      //When
      const result = await request.get(`${basePath}${route}/${id}`);

      //Then
      expect(result.statusCode).toEqual(status);
    });

    it("should return with status code 200 on image found", async () => {
      //Given
      const id = 5;
      const status = 200;
      const image = new ImageBuilder().AFullRandomImage().Build();
      getByIdAsyncMock = Promise.resolve(image);

      //When
      const result = await request.get(`${basePath}${route}/${id}`);

      //Then
      expect(result.status).toEqual(status);
    });

    it("should return an image when found", async () => {
      //Given
      const id = 5;
      const image = new ImageBuilder().AFullRandomImage().Build();
      getByIdAsyncMock = Promise.resolve(image);

      //When
      const result = await request.get(`${basePath}${route}/${id}`);

      //Then
      expect(result.body).toEqual(image);
    });
  });
});
