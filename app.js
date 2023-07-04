const express = require("express");
require('dotenv').config();
const https = require("https");
const bodyParser = require("body-parser");

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

app.get("/",function(req,res){
    res.sendFile(__dirname + "/index.html");
})
app.post("/", function(req, res){
    
    var query = req.body.cityname;
    query = query.slice(0,1).toUpperCase() + query.slice(1);

    const appkey = process.env.OPENWEATHER_API_KEY;
    const url = "https://api.openweathermap.org/data/2.5/weather?q="+ query +"&appid="+ appkey +"&units=metric";

    https.get(url, function(response){
        if(response.statusCode === 200){ 
        response.on("data",function(data){

            const weatherData = JSON.parse(data);
            const temp = Math.round(weatherData.main.temp);
            var des = weatherData.weather[0].description;
            des = des.slice(0,1).toUpperCase() + des.slice(1);
            var icon = "https://openweathermap.org/img/wn/"+ weatherData.weather[0].icon +"@2x.png"

            res.render("index", {place : query, temperature : temp, description : des, ctry : weatherData.sys.country, icon : icon});
        })}else{
            res.status(404).send('Sorry, we cannot find that!');
        }
    })

})

app.listen(process.env.PORT || 3000, function(){
    console.log("Server is running.");
})
