const fs = require("fs");
const rfs = require("rotating-file-stream");
const path = require("path");

const logDirectory = path.join(__dirname, "../production_logs");
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const AccessLogStream = rfs.createStream("access.log", {
  interval: "1d",
  path: logDirectory,
});

const development = {
  name: "development",
  asset_path: "./assets",
  session_cookie_key: "blahsomething",
  db: "codeial_development",
  google_client_id:
    "432716467374-h7t3u1ujv9bniletbtdsjac395sbc6hm.apps.googleusercontent.com",
  google_client_secret: "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",
  google_call_back_url: "http://localhost:8000/users/auth/google/callback",
  jwt_secret: "codeial",
  morgan: {
    mode: "dev",
    options: { stream: AccessLogStream },
  },
};

const production = {
  name: process.env.CODEIAL_ENVIRONMENT,
  asset_path: process.env.ASSET_PATH,
  session_cookie_key: process.env.CODEIALSESSION_COOKIE_KEY,
  db: process.env.CODEIAL_DB,
  google_client_id: process.env.GOOGLE_CLIENT_ID,
  google_client_secret: process.env.GOOGLE_CLIENT_SECRET,
  google_call_back_url: process.env.GOOGLE_CALLBACK_URL,
  jwt_secret: process.env.CODEIAL_JWT_SECRET,
  morgan: {
    mode: "combined",
    options: { stream: AccessLogStream },
  },
};

module.exports =
  eval(process.env.CODEIAL_ENVIRONMENT) == undefined
    ? development
    : eval(process.env.CODEIAL_ENVIRONMENT);
