import axios from "axios";
require("dotenv").config({ path: "variables.env" });

describe("/images", () => {
  const port = process.env.DEFAULT_PORT;
  const basePath = `http://localhost:${port}/images`;

  it("should return 200 status", async () => {
    //Given

    //When
    const result = await axios.get(basePath);

    //Then
    expect(result.status).toEqual(200);
  });

  it("should accept id as a query parameter 200 status", async () => {
    //Given
    const id = 5;

    //When
    const result = await axios.get(`${basePath}/${id}`);

    //Then
    expect(result.status).toEqual(200);
  });
});
