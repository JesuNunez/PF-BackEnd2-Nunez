import express from "express";
import { engine as handlebarsEngine } from "express-handlebars";
import MongoStore from "connect-mongo";
import passport from "passport";
import cookieParser from "cookie-parser";
import initializePassport from "./config/passport.config.js";
import viewsRouter from "./routes/views.router.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import sessionRouter from "./routes/session.router.js";
import "./database.js";

const app = express();
const PUERTO = 8080;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("./src/public"));
app.use(cookieParser());

// Passport
initializePassport();
app.use(passport.initialize());

// Express-Handlebars
app.engine(
    "handlebars",
    handlebarsEngine({
        defaultLayout: "main", 
    })
);
app.set("view engine", "handlebars");
app.set("views", "./src/views");

// Rutas
app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/sessions", sessionRouter);

// Inicio del servidor
app.listen(PUERTO, () => {
    console.log(`Servidor escuchando en el http://localhost:${PUERTO}`);
});