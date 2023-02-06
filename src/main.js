import express from "express";
import session from "express-session";
import { Server as HttpServer } from "http";
import { Server as Socket } from "socket.io";

import MongoStore from "connect-mongo";
const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true };

import config from "./config.js";

import mensajesWs from "./routers/ws/mensajes.js";
import productosWs from "./routers/ws/productos.js";

import productosWebRouter from "./routers/web/home.js";
import loginWebRouter from "./routers/web/login.js";

//--------------------------------------------
// instancio servidor, socket y api

const app = express();
const httpServer = new HttpServer(app);
const io = new Socket(httpServer);

/*----------- Motor de plantillas -----------*/
app.set("view engine", "ejs");

//--------------------------------------------
// configuro el socket

io.on("connection", async (socket) => {
  console.log("Nuevo cliente conectado!");

  mensajesWs(socket);
  productosWs(socket);
});

//--------------------------------------------
// configuro el servidor

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(
  session({
    store: MongoStore.create({
      mongoUrl:
        "mongodb+srv://coder:coder@cluster0.4o8q9da.mongodb.net/sessions?retryWrites=true&w=majority",
      mongoOptions: advancedOptions,
    }),
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60000,
    },
  })
);

//--------------------------------------------
// rutas
app.use(productosWebRouter);
app.use(loginWebRouter);

//--------------------------------------------
// inicio el servidor

const connectedServer = httpServer.listen(config.PORT, () => {
  console.log(
    `Servidor http escuchando en el puerto ${connectedServer.address().port}`
  );
});
connectedServer.on("error", (error) =>
  console.log(`Error en servidor ${error}`)
);