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
  const emptyArrPromise = Promise.resolve([]);
  let getByIdAsyncMock: Promise<Image | null> = nullPromise;
  let addAsyncMock: Promise<Image | null> = nullPromise;
  let getAllAsyncMock: Promise<Image[]> = emptyArrPromise;
  let saveImageAsyncMock: Promise<string | null> = nullPromise;

  beforeAll(() => {
    const imageRepositoryImpl: imageRepository = {
      getAllAsync: () => getAllAsyncMock,
      getByIdAsync: () => getByIdAsyncMock,
      addAsync: () => addAsyncMock,
      saveImageAsync: () => saveImageAsyncMock,
    };
    const app = serverSetup({ imageRepository: imageRepositoryImpl });
    request = supertest.agent(app);
  });

  afterEach(() => {
    // reset back to default after each
    getByIdAsyncMock = nullPromise;
    addAsyncMock = nullPromise;
    getAllAsyncMock = emptyArrPromise;
    saveImageAsyncMock = nullPromise;
  });

  describe("@GET /", () => {
    it("should return 200 status", async () => {
      // Given
      const status = 200;

      //When
      const result = await request.get(`${basePath}`);

      //Then
      expect(result.status).toEqual(status);
    });
  });

  describe("@GET /:id", () => {
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

  describe("@POST /", () => {
    it("should return status 301 on empty JSON", async () => {
      // Given
      const status = 301;

      //When
      const result = await request
        .post(`${basePath}${route}`)
        .send({})
        .set("Accept", "application/json");

      //Then
      expect(result.statusCode).toEqual(status);
    });

    it("should return status 301 on empty missing image param", async () => {
      // Given
      const status = 301;
      const image = undefined;
      const label = "test value";

      //When
      const result = await request
        .post(`${basePath}${route}`)
        .send({ image, label })
        .set("Accept", "application/json");

      //Then
      expect(result.statusCode).toEqual(status);
    });

    it("should return status 301 on invalid image param type", async () => {
      // Given
      const status = 301;
      const invalidImageTypes = ["a", 123, "abc123", {}];
      const label = "test value";

      for (let i = 0; i < invalidImageTypes.length; i++) {
        const image = invalidImageTypes[i];

        //When
        const result = await request
          .post(`${basePath}${route}`)
          .send({ image, label })
          .set("Accept", "application/json");

        //Then
        expect(result.statusCode).toEqual(status);
      }
    });

    it("should return status 301 on invalid image param type", async () => {
      // Given
      const status = 301;
      const image =
        "https://kyledavisdev.com/_next/image?url=%2Fstatic%2Fprofile-pic.jpg&w=256&q=75";
      const label = "test value";

      //When
      const result = await request
        .post(`${basePath}${route}`)
        .send({ image, label })
        .set("Accept", "application/json");

      //Then
      expect(result.statusCode).toEqual(status);
    });
  });
});
