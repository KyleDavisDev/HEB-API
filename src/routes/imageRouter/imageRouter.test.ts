import axios from "axios";
require("dotenv").config({ path: "variables.env" });

describe("/images", () => {
  jest.setTimeout(10000);
  const port = process.env.DEFAULT_PORT;
  const basePath = `http://localhost:${port}/images`;

  it("should return 200 status", async () => {
    //Given
    const status = 200;

    //When
    const result = await axios.get(basePath);

    //Then
    expect(result.status).toEqual(200);
  });

  it("/:id should accept id as a query parameter 200 status", async () => {
    //Given
    const id = 5;
    const status = 200;

    //When
    const result = await axios.get(`${basePath}/${id}`);

    //Then
    expect(result.status).toEqual(status);
  });

  it("/:id should return 301 if id is not a number-able", async () => {
    //Given
    const id = "test";
    const status = 301;

    //When
    const result = await axios
      .get(`${basePath}/${id}`)
      .catch((x) => x.response);

    //Then
    expect(result.status).toEqual(status);
  });
});
