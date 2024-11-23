//imports
import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
//server configuration
const app = express();
const port = 3000;
const API_URL = "https://pokeapi.co/api/v2/";
// public folder and bodyParser set.
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
//utility functions
function getRandomNumber(min, max) {
    return Math.floor(Math.random()*(max - min + 1)) + min;
};
function turnPokemonData(pokemon) {
    return new pokemonData(pokemon.id, capitalizeFirstLetter(pokemon.name), pokemon.sprites.front_default, formatTypes(pokemon.types));
};
function formatTypes(typeArray) {
    return typeArray
        .map(element => element.type.name)  // take the names
        .map(element => new typeFormat(element));  // create a object for the name
};
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

//basic e utility classes
class pokemonData {
    constructor(idNumber, pokemonName, imgURL, pokemonType){
        this.idNumber = "#" + idNumber;
        this.pokemonName = pokemonName;
        this.imgURL = imgURL;
        this.pokemonType = pokemonType;
    };
};
class typeFormat {
    constructor (typeName) {
        this.typeName = capitalizeFirstLetter(typeName);
        this.typeColor = "bg-" + bgDictionary[typeName];
    }
};
let bgDictionary = {
    "fire":"danger",
    "normal":"secondary",
    "water":"primary",
    "electric":"warning",
    "grass":"success",
    "ice":"info",
    "fighting":"danger",
    "poison":"dark",
    "flying":"secondary",
    "psychic":"info",
    "ground":"warning",
    "bug":"success",
    "rock":"secondary",
    "ghost":"secondary",
    "dragon":"danger",
    "dark":"dark",
    "steel":"info",
    "fairy":"info"
};
//ENDPOINTS
//Home page, with a single pokemon random generation
app.get("/", async (req, res) => {
    try{
        const resArray = [];
        const newId = getRandomNumber(1, 1010);
        const response = await axios.get(API_URL + "pokemon/" + newId);
        resArray.push(turnPokemonData(response.data));
        res.render("index.ejs", {
            pokemonArray: resArray
       });
    } catch(error) {
      console.log(error.response.data);
      res.status(500);
    }
});
//post para busta de pokemons por id, nome ou tipo
app.post("/search", async (req, res) => {
    try{
        if(req.body && req.body.userTyped && req.body.userTyped.trim() !== ""){
            const resArray = [];
            const userReq = req.body.userTyped.toString().toLowerCase();
            if(userReq in bgDictionary){
                const response = await axios.get(API_URL + "type/" + userReq);
                if (response.data && response.data.pokemon) {
                    for (const element of response.data.pokemon) {
                        try {
                            const pkData = await axios.get(element.pokemon.url);
                            if (pkData.data) {
                                resArray.push(turnPokemonData(pkData.data));
                            }
                        } catch (err) {
                            console.log(`Erro ao buscar dados do Pokémon: ${element.pokemon.name}`);
                        } 
                    };
                };
            } else {
                const response = await axios.get(API_URL + "pokemon/" + userReq);
                resArray.push(turnPokemonData(response.data));
            }
            res.render("index.ejs", {
                    pokemonArray: resArray
            });
        } else {
            res.redirect("/");
        }
    } catch(err) {
        if (err.response && err.response.status === 404) {
            console.log("Pokémon não encontrado (erro 404).");
        } else {
            console.log("Erro ao buscar Pokémon específico: ", err.message);
        };
        res.redirect("/");
    }
});
//listen function, always in the end
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });