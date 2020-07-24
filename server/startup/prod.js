const helmet = require("helmet"); //Secure HTTP headers
const compression = require("compression"); //Compreess request size
const serveStatic = require("serve-static");
const path = require("path");
const cwd = process.cwd();

const chalk = require("chalk");
const log = text => console.log(chalk.cyanBright(`[prod] ${text}`));

module.exports = function(app) {
  // Added express middleware/options for prod
  app.use(helmet());
  app.use(compression());
  app.enable("trust proxy");

  log("P R O D U C T I O N mode");
  log("serving static content: ", path.join(cwd, "build"));

  // PUBLIC_URL if running docker local
  const { PUBLIC_URL } = process.env;

  // Redirect to https if not running in docker
  !PUBLIC_URL &&
    app.use((req, res, next) => {
      if (req.secure) {
        log("[prod] secure request:", req.secure);
        next();
      } else {
        log(`[prod] not secure, redirect to https://${req.headers}${req.url}`);
        res.redirect(`https://${req.headers}${req.url}`);
      }
    });

  // Serve static revved files with uncoditional cache
  app.use(
    serveStatic(path.join(cwd, "build"), {
      index: false,
      setHeaders: (res, path) => {
        res.setHeader("Cache-Control", "public, immutable, max-age=31536000");
      }
    })
  );

  // Route any non API and non static file to React Client Router for SPA development
  app.use((req, res) => {
    log("[prod] sending index.html...", path.join(cwd, "build", "index.html"));
    res.sendFile(path.join(cwd, "build", "index.html"));
  });
};
