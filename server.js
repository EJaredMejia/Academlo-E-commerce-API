const dotenv = require("dotenv");

const { app } = require("./app");

// Utils
const { loadModels } = require("./utils/load-models.util");

dotenv.config({ path: "./config.env" });

const startServer = async () => {
  try {
    await loadModels();
    // Set server to listen
    const PORT = process.env.PORT || 4000;

    app.listen(PORT, () => {
      console.log("Express app running!");
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();
