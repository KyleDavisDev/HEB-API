import axios from "axios";
require("dotenv").config({ path: "variables.env" });

describe("server", () => {
  const port = process.env.DEFAULT_PORT;

  it("should be created", async () => {
    //Given

    //When
    const result = await axios.get(`http://localhost:${port}`);

    //Then
    expect(result.status).toEqual(200);
  });
});
