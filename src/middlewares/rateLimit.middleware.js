const rateLimit = require("express-rate-limit");

exports.publicLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 20
});