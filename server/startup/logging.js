require("express-async-errors");

// const winston = require("winston");

module.exports = function (winston, env) {
  winston.exceptions.handle(
    new winston.transports.Console(),
    new winston.transports.File({
      filename: "uncaughtException.log",
    })
  );

  //subscription to process
  process.on("uncaughtRejection", (ex) => {
    throw ex;
  });

  // const console = new winston.transports.Console({
  //   level: "info",
  //   format: winston.format.simple(),
  // });

  const files = new winston.transports.File({
    filename: "logfile.log",
    level: "error",
  });

  winston.add(files); //.add(console)

  if (env !== "test") console.log("[logging] winston loaded");
};
