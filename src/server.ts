import { app } from "./app";
import { loadModels } from "./utils/load-models.util";

const startServer = async () => {
  try {
    await loadModels();

    const PORT = process.env.PORT || 4000;

    app.listen(PORT, () => {
      console.log(`Express app running on port: ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();
