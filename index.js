require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const mongodbRoute =  process.env.MONGO_URI;

//Routes
const playersRoutes = require('./src/routes/players');
const timeRoutes = require('./src/routes/time');

const app = express();
const PORT = process.env.PORT || 3000;

// Use bodyparser
app.use(bodyParser.json());

// Rutas
app.use('/players', playersRoutes);
app.use('/time', timeRoutes);


async function start() {
  try {
    await mongoose.connect(mongodbRoute);
    app.listen(PORT, () => {
      console.log(`API is listening on port ${PORT}`);
    });
    console.log("Conexión con Mongo correcta.");
  } catch (error) {
    console.log(`Error al conectar a la base de datos: ${error.message}`);
  }
}

start();

