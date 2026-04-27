require("dotenv").config();

const startServer = require("./src/app");

const PORT = process.env.PORT || 5000;

startServer().then(app => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error("Failed to start server:", err);
});