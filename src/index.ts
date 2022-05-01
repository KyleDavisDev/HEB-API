import { imageRepositoryImpl } from "./repositories/imageRepository/imageRepositoryImpl";

require("dotenv").config({ path: "variables.env" });
import { serverSetup } from "./serverSetup/serverSetup";

// grab port from .env file or assign default
const port: number = parseInt(<string>process.env.DEFAULT_PORT, 10) || 8080;
const app = serverSetup({ imageRepository: imageRepositoryImpl });
app.listen(port, () => {
  console.log(`Listening on ${port}`);
});
