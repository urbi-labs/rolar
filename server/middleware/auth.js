const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function (req, res, next) {
  if (!config.get("requiresAuth")) return next();

  const token = req.header("rolar-token");

  if (!token)
    return res.status(401).send("Acceso denegado. No se encontró el token.");

  try {
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).send("Token inválido");
  }
};
