import bodyParser from 'body-parser';
import 'dotenv/config';
import express from 'express';
import axios from 'axios';


const app = new express();
const api_url = "https://api.openweathermap.org/data/2.5/weather";
const api_key = process.env.API_KEY;

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended:true}));


app.listen(3000,(req,res)=>{
    console.log("server running at port: 3000");
})

app.get('/',async (req,res)=>{
    await getWeatherInfo("thanjavur",res);
})

app.get('/search',async (req,res)=>{
    await getWeatherInfo(req.query.city,res);
})

async function getWeatherInfo(city,res){
    try{
        const response = await axios.get(api_url,{
            params : {
                appid : api_key,
                q : city,
                units : "metric"
            }
        }) 
        const result = response.data;
        const weatherData = {
            temp: result.main.temp + "°C",
            temp_min: result.main.temp_min,
            temp_max: result.main.temp_max,
            humidity: result.main.humidity,
            wind: result.wind,
            city: result.name,
            weather_icon : result.weather[0].main.toLowerCase()
        };
        console.log(result);
        res.render('index.ejs',weatherData);
    } catch (err) {
        console.error("Error fetching weather data:", err.message);

        const weatherData = {
            temp: "City Not Found",
            temp_min: "",
            temp_max: "",
            humidity: "",
            wind: { speed: "" },
            city: "",
            weather_icon: "error",
        };
        
        res.render('index.ejs', weatherData);

    }
}