import axios from "axios";
require("dotenv").config({ path: "variables.env" });

describe("/images", () => {
  jest.setTimeout(10000);
  const port = parseInt(<string>process.env.DEFAULT_PORT, 10) || 8080;
  const basePath = `http://localhost:${port}/images`;

  it("should return 200 status", async () => {
    //Given
    const status = 200;

    //When
    const result = await axios.get(basePath);

    //Then
    expect(result.status).toEqual(200);
  });

  // it("/:id should accept id as a query parameter 200 status", async () => {
  //   //Given
  //   const id = 5;
  //   const status = 200;
  //
  //   //When
  //   const result = await axios.get(`${basePath}/${id}`);
  //
  //   //Then
  //   expect(result.status).toEqual(status);
  // });

  it("/:id should return 301 if id is not a positive numeric value", async () => {
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
        .get(`${basePath}/${id}`)
        .catch((x) => x.response);

      //Then
      expect(result.status).toEqual(status);
    }
  });
});
