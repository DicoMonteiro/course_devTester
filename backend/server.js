"use strict";

const Hapi = require("@hapi/hapi");
const mongoose = require("mongoose");

const mongoURL = "mongodb+srv://adrianobma:adrianobma@cluster0.dkorq.mongodb.net/zaplinkdb?retryWrites=true&w=majority"

mongoose.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true})

mongoose.connection.on('connected', () => {
  console.log('MongoDB conntected');
})

mongoose.connection.on('error', (error) => {
  console.log('MongoDB error' + error);
})

console.log(`Ambiente => ${process.env.NODE_ENV}`)

// if (process.env.NODE_ENV === 'test') {
//   mongoose.connection.dropDatabase()
// }

const contactRoutes = require('./routes/contact.routes')
const userRoutes = require('./routes/user.routes')

const server = Hapi.server({
  port: 3000,
  host: "localhost",
  routes: {
    cors: {
      origin:['*']
    }
  }
});

server.route({
  method: "GET",
  path: "/",
  handler: (request, h) => {
    return {
      message: "Welcome to ZapLink API",
      course: "DevTesters",
      company: "by QANinja",
    };
  },
});

server.route(contactRoutes)
server.route(userRoutes)


server.start((err) => {

  if (err) {
    throw err;
  }
  console.log("Server running on %s", server.info.uri);
});

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

exports.init = async () => {
  return server
}
