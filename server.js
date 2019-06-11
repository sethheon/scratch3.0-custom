const express = require("express");
const https = require("https");
const http = require("http");
const favicon = require("express-favicon");
const path = require("path");
const PORT = process.env.PORT || 8080;

const app = express();

app.use(favicon(__dirname + "/build/static/favicon.ico"));
// the __dirname is the current directory from where the script is running

app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, "build")));

app.get("/ping", function(req, res) {
  return res.send("pong");
});

app.get("/*", function(req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

// const fs = require("fs");
// const options = {
//   key: fs.readFileSync("./keys/openssl/key.pem"),
//   cert: fs.readFileSync("./keys/openssl/cert.pem"),
//   passphrase: "password"
// };

app.listen(PORT, _ => console.log(`🐷 Listening on ${PORT} 🐷`));
