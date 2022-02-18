const express = require("express");
const env = require("./config/environment");
const app = express();
const port = 8000;
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const expressLayouts = require("express-ejs-layouts");
const db = require("./config/mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocal = require("./config/passport-local-strategy");
const passportJWT = require("./config/passport-jwt-strategy");
const passportGoogle = require("./config/passport-local-oauth2-strategy");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const customMware = require("./config/middleware");
const path = require("path");

app.use(express.urlencoded());
app.use(cookieParser());
app.use(express.static(env.asset_path));
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use(expressLayouts);
app.use(logger(env.morgan.mode, env.morgan.options));
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(
  session({
    name: "codial",
    secret: env.session_cookie_key,
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 100,
    },
    store: MongoStore.create(
      {
        mongoUrl: "mongodb://localhost/codeial_development",
        mongooseConnect: db,
        autoRemove: "disabled",
      },
      function (err) {
        console.log(err || "connect mongo setup ok");
      }
    ),
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);
app.use(flash());
app.use(customMware.setFlash);

const chatServer = require("http").Server(app);
const chatSockets = require("./config/chat_sockets").chatSockets(chatServer);
chatServer.listen(5000);
console.log("chat server is listening on port 5000");

app.use("/", require("./routes"));

app.listen(port, function (err) {
  if (err) {
    console.log(`Error in running the server: ${err}`);
  }
  console.log(`Server is running on port: ${port}`);
});
