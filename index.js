//imports
import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
//server configuration
const app = express();
const port = 3000;
const API_URL = "https://pokeapi.co/api/v2/pokemon/";
// public folder and bodyParser set.
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

//listen function, always in the end
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });