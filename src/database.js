import mongoose from "mongoose";

mongoose
    .connect("mongodb+srv://Estudiante:Nuñez@cluster0.ybe8o.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => {
        console.log("Conexión a la Base de Datos exitosa");
    })
    .catch((error) => {
        console.log("Error al conectarse a la Base de Datos: ", error);
    });
