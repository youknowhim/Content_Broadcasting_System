const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
const initDB = require("./models/init.db");

const startServer = async () => {
  await initDB(); 

  const app = express();

  app.use(express.json());

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.use("/auth", require("./routes/auth.routes"));
  app.use("/content", require("./routes/content.routes"));
  app.use("/approval", require("./routes/approval.routes"));
  app.use("/teacher", require("./routes/teacher.routes"));
  app.use("/public", require("./routes/public.routes"));
  app.use("/analytics", require("./routes/analytics.routes"));

  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  });

  return app;
};

module.exports = startServer;