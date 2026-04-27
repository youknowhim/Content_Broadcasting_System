const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Content Broadcasting API",
      version: "1.0.0",
      description: "Backend API for Content Broadcasting System"
    },
    servers: [
      {
        url: "https://content-broadcasting-system-65gt.onrender.com"
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    }
  },
  apis: ["./src/**/*.js"]
};

module.exports = swaggerJsdoc(options);
