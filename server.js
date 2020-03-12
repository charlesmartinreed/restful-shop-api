const http = require("http");
const config = require("dotenv").config();
const port = process.env.PORT || 3000;
const app = require("./app");

// express server is our request handler
const server = http.createServer(app);

// executes the listener defined in our createServer decalartion
server.listen(port, () => {
  console.log(`Now listening on ${port}`);
});
