import axios from "axios";

import { imageRepository } from "../../repositories/imageRepository/imageRepository";
require("dotenv").config({ path: "variables.env" });

const nullJestFn = jest.fn(() => null);
const getByIdAsyncFake = nullJestFn;
const emptyJestFn = jest.fn(() => []);
const getAllAsyncFake = emptyJestFn;
jest.mock("../../repositories/imageRepository/imageRepository", () => {
  return { getByIdAsync: getByIdAsyncFake, getAllAsync: getAllAsyncFake };
});

describe("/images", () => {
  jest.setTimeout(10000); // increase timeout
  const port = parseInt(<string>process.env.DEFAULT_PORT, 10) || 8080;
  const basePath = `http://localhost:${port}`;
  const route = "images";

  describe("/", () => {
    it("should return 200 status", async () => {
      //Given
      const status = 200;

      //When
      const result = await axios.get(basePath);

      //Then
      expect(result.status).toEqual(status);
    });
  });

  describe("/:id", () => {
    it("should accept id as a query parameter and return with 200 status", async () => {
      //Given
      const id = 5;
      const status = 200;

      //When
      const result = await axios.get(`${basePath}/${route}/${id}`);

      //Then
      expect(result.status).toEqual(status);
    });

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
        const result = await axios
          .get(`${basePath}/${route}/${id}`)
          .catch((x) => x.response);

        //Then
        expect(result.status).toEqual(status);
      }
    });
  });
});
